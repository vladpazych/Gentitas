using UnityEngine;
using System.Collections.Generic;

namespace Gentitas
{
    public abstract class Kernel : MonoBehaviour
    {
        public KernelInitializeType kernelInitializeType;
        public KernelExecuteType kernelExecuteType;
        public int intervalInMilliseconds;
        public int intervalInFrames;
        public bool executeOnBothIntervals;
        List<Gentitas.ChainSystem> chains = new List<Gentitas.ChainSystem>();
        Gentitas.ChainSystem[] chainsArray;
        int chainsArrayLength;

        float timerSeconds;
        int timerFrames;

        protected abstract void Setup();

        protected void Chain(Gentitas.ChainSystem system)
        {
            chains.Add(system);
        }

        void Initialize()
        {
            Setup();

            chainsArray = chains.ToArray();
            chainsArrayLength = chainsArray.Length;

            for (int i = 0; i < chainsArrayLength; i++)
            {
                chainsArray[i].Initialize();
            }

            timerFrames = intervalInFrames;
            timerSeconds = intervalInMilliseconds / 1000;
        }

        void Execute()
        {
            for (int i = 0; i < chainsArrayLength; i++)
            {
                chainsArray[i].Execute();
            }
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
                if (intervalInFrames == 0 && intervalInMilliseconds == 0) Execute();
                else
                {
                    timerSeconds -= Time.deltaTime;
                    timerFrames -= 1;

                    if (executeOnBothIntervals && timerSeconds <= 0 && timerFrames <= 0 ||
                        (timerSeconds <= 0 || timerFrames <= 0))
                    {
                        Execute();
                        timerSeconds = intervalInMilliseconds / 1000f;
                        timerFrames = intervalInFrames;
                    }
                }
            }
        }

        void LateUpdate()
        {
            if (kernelExecuteType == KernelExecuteType.LateUpdate)
            {
                if (intervalInFrames == 0 && intervalInMilliseconds == 0) Execute();
                else
                {
                    timerSeconds -= Time.deltaTime;
                    timerFrames -= 1;

                    if (executeOnBothIntervals && timerSeconds <= 0 && timerFrames <= 0 ||
                        (timerSeconds <= 0 || timerFrames <= 0))
                    {
                        Execute();
                        timerSeconds = intervalInMilliseconds / 1000f;
                        timerFrames = intervalInFrames;
                    }
                }
            }
        }

        void FixedUpdate()
        {
            if (kernelExecuteType == KernelExecuteType.FixedUpdate)
            {
                if (intervalInFrames == 0 && intervalInMilliseconds == 0) Execute();
                else
                {
                    timerSeconds -= Time.deltaTime;
                    timerFrames -= 1;

                    if (executeOnBothIntervals && timerSeconds <= 0 && timerFrames <= 0 ||
                        (timerSeconds <= 0 || timerFrames <= 0))
                    {
                        Execute();
                        timerSeconds = intervalInMilliseconds / 1000f;
                        timerFrames = intervalInFrames;
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