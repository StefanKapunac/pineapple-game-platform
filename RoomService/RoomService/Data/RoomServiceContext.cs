using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RoomService.Models;

namespace RoomService.Data
{
    public class RoomServiceContext : DbContext
    {
        public RoomServiceContext (DbContextOptions<RoomServiceContext> options)
            : base(options)
        {
        }

        public DbSet<Room> Rooms { get; set; }

        public DbSet<Participant> Participants { get; set; }
    }
}
