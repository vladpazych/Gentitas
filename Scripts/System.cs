using System.Collections;
using System.Collections.Generic;
using Entitas;

namespace Gentitas
{
    public abstract class InitializeSystem : Entitas.IInitializeSystem
    {
        public void Initialize()
        {
            Act();
        }

        protected abstract void Act();
    }

    public abstract class ExecuteSystem : Entitas.IExecuteSystem
    {
        public void Execute()
        {
            Act();
        }

        protected abstract void Act();
    }

    public abstract class ReactiveSystem<TEntity> : Entitas.ReactiveSystem<TEntity> where TEntity : class, Entitas.IEntity
    {
        protected ReactiveSystem(IContext<TEntity> context) : base(context) { }
        List<TriggerOnEvent<TEntity>> triggers = new List<TriggerOnEvent<TEntity>>();

        protected override bool Filter(TEntity entity)
        {
            return true;
        }

        protected sealed override void Execute(List<TEntity> entities)
        {
            Act(entities);
        }

        protected sealed override ICollector<TEntity> GetTrigger(IContext<TEntity> context)
        {
            SetTriggers();
            return context.CreateCollector(triggers.ToArray());
        }

        protected void Trigger(TriggerOnEvent<TEntity> trigger)
        {
            triggers.Add(trigger);
        }

        protected abstract void SetTriggers();
        protected abstract void Act(List<TEntity> entities);
    }

    public abstract class MultiReactiveSystem<TEntity, TContexts> : Entitas.MultiReactiveSystem<TEntity, TContexts>
        where TEntity : class, IEntity
        where TContexts : class, IContexts
    {
        protected TContexts contexts;

        protected MultiReactiveSystem(TContexts contexts) : base(contexts) { }
        List<ICollector> collectorList = new List<ICollector>();

        protected override bool Filter(TEntity entity)
        {
            return true;
        }

        protected sealed override void Execute(List<TEntity> entities)
        {
            Act(entities);
        }

        protected sealed override ICollector[] GetTrigger(TContexts contexts)
        {
            SetTriggers();
            return collectorList.ToArray();
        }

        protected void Trigger(ICollector collector)
        {
            collectorList.Add(collector);
        }

        protected abstract void SetTriggers();
        protected abstract void Act(List<TEntity> entities);
    }
}