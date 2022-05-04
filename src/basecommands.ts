import { Chat, Client, Post } from "photop-client";

const help = {
	like: "Likes a post",
	unlike: "Unlike a post",
	ping: "Sends back pong.",
	post: "sb!post {message} Posts a message. Posts to the same group if ran inside one.",
	echo: "sb!echo {message} Sends a message",
	reply: "sb!reply {message} Replies with a message",
	disconnect: "{perms>=1} Stop listening for commands in current post.",
	follow: "sb!follow {username} Follows a user by their username",
	unfollow: "sb!unfollow {username} Unfollows a user by their username",
	help: "Shows a list of commands or info on a specific command",
	about: "sb!about {topic} Gives opinion on certain things.",
	joingroup: "sb!joingroup {inviteid} Invites the bot to a group.",
	postglobal: "sb!postglobal {message} Posts to global regardless of whether command was ran inside a group.",
	// stfu: "sb!stfu Tells everyone to shut the fuck up.",
};


interface Context {
	client: Client
}

const commands: Record<
	string,
	{ func: (params: {chat: Chat, body: string, context: Context}) => void; perms?: number }
> = {
	// stfu: {
	// 	func: async ({chat})=>{
	// 	}
	// },
	shrug: {
		func: ({chat})=>{
			chat.post.chat("¯\\_(ツ)_/¯");
		}
	},
	joingroup: {
		func: async ({chat, body, context: {client}}) => {
			try {
				const group = await client.joinGroup(body);
				
				const post = await group.post("SockBot has joined!")
				post.chat("You can invite me with sb!joingroup on a post that I am listening. (Not this one)");
				chat.reply(`Joined ${group.name}!`);
			} catch (e) {
				chat.reply(String(e));
			}
		}
	},
	leavegroup: {
		func: async ({context: {client}, chat, body}) => {
			const group = client.groups[body];
			if (group && group.members[client.userid!]) {
				await group.leave();
				chat.reply("Left group")
				return;
			}
			chat.reply("Not part of group.")
		},
		perms: 1,
	},
	like: {
		func: async ({chat}) => {
			chat.post.like();
		},
	},
	unlike: {
		func: async ({chat}) => {
			chat.post.unlike();
		},
	},
	ping: {
		func: async ({chat}) => {
			chat.reply("Pong");
		},
	},
	postglobal: {
		func: async ({context: {client}, body}) => {
			client.post(body);
		}
	},
	post: {
		func: async ({context: {client}, chat, body}) => {
			if (chat.group) {
				chat.group.post(body)
			} else {
				client.post(body);
			}
		},
	},
	echo: {
		func: async ({chat, body}) => {
			if (body === "") {
				chat.reply("Cannot send an empty message. Ex: sb!echo test");
			} else {
				chat.post.chat(body);
			}
		},
	},
	follow: {
		func: async ({context: {client}, chat, body}) => {
			const user = await client.getUserFromUsername(body);
			if (!user) return chat.reply("User not found")
			user.follow().then((success) => {
				if (success) {
					chat.reply(`Followed ${user!.username}`);
				} else {
					chat.reply(`Failed to follow ${user!.username}. (May already be following)`)
				}
			});
		},
	},
	unfollow: {
		func: async ({context: {client}, chat, body}) => {
			const user = await client.getUserFromUsername(body);
			if (!user) return chat.reply("User not found")
			user.follow().then((success) => {
				if (success) {
					chat.reply(`Followed ${user!.username}`);
				} else {
					chat.reply(`Failed to unfollow ${user!.username}. (May already not be following)`)
				}
			});
		},
	},
	reply: {
		func: async ({chat, body}) => {
			if (body === "") {
				chat.reply(
					"Cannot reply with an empty message. Ex: sb!reply test"
				);
			} else {
				chat.reply(body);
			}
		},
	},
	disconnect: {
		func: async ({chat}) => {
			chat.post.disconnect();
			chat.post.chat(
				"SockBot disconnected. Reason: Disconnected by user."
			);
		},
		perms: 1,
	},
	help: {
		func: async ({chat, body}) => {
			if (body === "") {
				chat.reply(
					Object.keys(help).join(", ") +
						". You can use sb!help {command} to get more info."
				);
			} else if (body in help) {
				chat.reply(help[body as keyof typeof help]);
			} else {
				chat.reply(`not found: "${body}"`);
			}
		},
	},
	about: {
		func: async ({chat, body}) => {
			if (body.toLowerCase().match("abicambot")) {
				chat.reply("Doesn't even work");
			} else if (body.toLowerCase().match("sockbot")) {
				chat.reply("amazing bot");
			} else if (body.toLowerCase().match("pyx")) {
				chat.reply("what even is that lmao");
			} else if (body.toLowerCase().match("wutbot")) {
				chat.reply("go away");
			} else {
				chat.reply(
					"Doesn't seem like i recognize what that is. Try asking about abicambot"
				);
			}
		},
	},
};

export function Commands(post: Post, client: Client) {
	// if (post.text.match("+SockBot")) ...
	return (chat: Chat)=>{
		const args = chat.text.match(/^[\t ]*sb\!([A-Za-z]+)(.*)/);
		if (args) {
			const cmd = args[1].toLowerCase();
			const body = args[2].substring(1);

			// commands["constructor"] works and will end up crashing sockbot since there is nothing to run.
			const commandObj = commands.hasOwnProperty(cmd) && commands[cmd];
			if (commandObj) {
				const perm = commandObj.perms || 0;
				if (perm === 1) {
					if (!(
						chat.user.roles.indexOf("Owner") > 0 ||
						chat.user.roles.indexOf("Developer") > 0 ||
						chat.user.id === "61b4520e4ea86c6fe9800c3b"
					)) {
						chat.reply("Permission required");
					}
				}
				commandObj.func({chat, body, context: {client}});
			} else {
				chat.reply(`Command not found ${cmd}`);
			}
		}
	}
}