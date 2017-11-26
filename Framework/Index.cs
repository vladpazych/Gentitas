using System.Collections;
using System.Collections.Generic;
using Entitas;

namespace Entitas.Gentitas
{
    public abstract class Index<TType, TEntity> where TEntity : class, IEntity
    {
        protected Dictionary<TType, HashSet<TEntity>> lookup;

        protected Index()
        {
            lookup = new Dictionary<TType, HashSet<TEntity>>();
        }

        protected virtual bool Filter(TEntity entity)
        {
            return true;
        }
    }
}