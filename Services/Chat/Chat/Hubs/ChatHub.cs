using Chat.Hubs.Clients;
using ChatApi.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatApi.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {
        // maps username to connection id
        private static readonly Dictionary<string, string> _ConnectionsMap = new Dictionary<string, string>();


        public async Task SendMessage(ChatMessage message, string groupName)
        {
            await Clients.Group(groupName).ReceiveMessage(message);
            //await Clients.Others.SendAsync("ReceiveMessage", user, message);
            //await Clients.Caller.SendAsync("MessageSent", message);
        }

        public async Task SendPrivate(string fromUser, string message, string toUser)
        {
            var receiverId = _ConnectionsMap[toUser];
            await Clients.Client(receiverId).ReceiveMessage(new ChatMessage { User = fromUser, Message = message});
            //await Clients.Client(Context.ConnectionId).SendAsync("MessageSent", message);
        }

        // first method that client should invoke
        public async Task Join(string user, string groupName)
        {
            //add user to map
            AddUser(user);
            //add user to group
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await SendMessage(new ChatMessage { User = user, Message = " joined!" }, groupName);
        }

        private void AddUser(string username)
        {
            _ConnectionsMap.Add(username, Context.ConnectionId);
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            //remove user from map
            var a = _ConnectionsMap.Where(p => p.Value == Context.ConnectionId).Select(p => p.Key).ToList();
            foreach(var s in a)
            {
                _ConnectionsMap.Remove(s);
            }
            return base.OnDisconnectedAsync(exception);
        }
    }
}
