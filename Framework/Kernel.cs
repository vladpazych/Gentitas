using UnityEngine;
using System.Collections.Generic;
using System.Reflection;

namespace Entitas.Gentitas
{
    public abstract class Kernel : MonoBehaviour
    {
        public KernelInitializeType kernelInitializeType;
        public KernelExecuteType kernelExecuteType;
        public int intervalMs;
        public int intervalFrames;
        [Tooltip("Systems will execute when both intervals are fulfilled")]
        public bool waitForBothIntervals;
        public Systems.ChainSystem rootChainSystem;

        float timerSeconds;
        int timerFrames;

        protected abstract void Setup();

        protected void Add(Systems.ChainSystem system)
        {
            rootChainSystem.Add(system);
        }

        protected void Add(Entitas.ISystem system)
        {
            rootChainSystem.Add(system);
        }

        void Initialize()
        {
            var rootChainType = GetType();
            var rootChainName = rootChainType.Namespace + "." + rootChainType.Name;
            rootChainSystem = new Systems.ChainSystem(rootChainName);
            Setup();

            rootChainSystem.Initialize();

            timerFrames = intervalFrames;
            timerSeconds = intervalMs / 1000;
        }

        void Execute()
        {
            rootChainSystem.Execute();
        }



        void Awake()
        {
            if (kernelInitializeType == KernelInitializeType.Awake)
            {
                Initialize();
            }
        }

        void Start()
        {
            if (kernelInitializeType == KernelInitializeType.Start)
            {
                Initialize();
            }
        }

        void Update()
        {
            if (kernelExecuteType == KernelExecuteType.Update)
            {
                if (intervalFrames == 0 && intervalMs == 0) Execute();
                else
                {
                    timerSeconds -= Time.deltaTime;
                    timerFrames -= 1;

                    if (waitForBothIntervals && timerSeconds <= 0 && timerFrames <= 0 ||
                        (timerSeconds <= 0 || timerFrames <= 0))
                    {
                        Execute();
                        timerSeconds = intervalMs / 1000f;
                        timerFrames = intervalFrames;
                    }
                }
            }
        }

        void LateUpdate()
        {
            if (kernelExecuteType == KernelExecuteType.LateUpdate)
            {
                if (intervalFrames == 0 && intervalMs == 0) Execute();
                else
                {
                    timerSeconds -= Time.deltaTime;
                    timerFrames -= 1;

                    if (waitForBothIntervals && timerSeconds <= 0 && timerFrames <= 0 ||
                        (timerSeconds <= 0 || timerFrames <= 0))
                    {
                        Execute();
                        timerSeconds = intervalMs / 1000f;
                        timerFrames = intervalFrames;
                    }
                }
            }
        }

        void FixedUpdate()
        {
            if (kernelExecuteType == KernelExecuteType.FixedUpdate)
            {
                if (intervalFrames == 0 && intervalMs == 0) Execute();
                else
                {
                    timerSeconds -= Time.deltaTime;
                    timerFrames -= 1;

                    if (waitForBothIntervals && timerSeconds <= 0 && timerFrames <= 0 ||
                        (timerSeconds <= 0 || timerFrames <= 0))
                    {
                        Execute();
                        timerSeconds = intervalMs / 1000f;
                        timerFrames = intervalFrames;
                    }
                }
            }
        }
    }

    public enum KernelInitializeType
    {
        Awake,
        Start,
        Enable
    }

    public enum KernelExecuteType
    {
        Update,
        LateUpdate,
        FixedUpdate
    }
}
