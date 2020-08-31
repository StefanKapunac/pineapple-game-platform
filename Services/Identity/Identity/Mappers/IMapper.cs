using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.Mappers
{
    public interface IMapper<E, D>
    {
        public E toEntity(D dto);
    }
}
