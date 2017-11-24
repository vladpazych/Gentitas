# Gentitas - Code Generator for Entitas

Gentitas is a fast code generator for Entitas. It watches your `Assets` folder for `.gentitas.cs` files and generates Entitas API from them.

---

### **[» Download](#download-gentitas)**
### **[» Install and run](https://github.com/vladpazych/Gentitas/wiki/Install-and-run)**
### **[» Ask a question / Report a bug](https://github.com/vladpazych/Gentitas/issues/new)**
### **[» Wiki and examples](https://github.com/vladpazych/Gentitas/wiki)**
### **[» Go to Entitas repository](https://github.com/sschmid/Entitas-CSharp)**

---

First glimpse
=============
```csharp
// Declaration
namespace Game.YourModule.Declaration
{
    public class State : Context
    {
        State()
        {
            var Application = Component().GroupSingle;
            var RabbitName = Component<string>().Index;
            var Rabbit = Component();
            var RabbitUnit = Component<RabbitUnit>().GroupSingle;
            var Fast = Component();
            var Speed = Component<float>().Group;

            var RabbitWithName = Group(Match.All(Sceme, RabbitName));
            var FastRabbitName = Index(RabbitName, Rabbit, Fast);
        }
    }
}

// Usage
void Example ()
{
    // Components
    var entity = Contexts.state.CreateComponent();
    entity.rabbitName = "Steve";
    entity.rabbit = true;
    entity.fast = truel
    entity.speed = 10f;

    // Groups
    var application = Contexts.state.applicationEntity;
    var speedGroup = Contexts.state.speedGroup;
    var speedEntities = Contexts.state.speedEntities;
    var rabbitUnit Contexts.state.rabbitUnit;

    // Index
    Contexts.state.fastRabbitNameIndex.GetCount("Steve");
    Contexts.state.fastRabbitNameIndex.Find("Steve");
    Contexts.state.fastRabbitNameIndex.FindSingle("Steve");
}
```

How to use
==========
- [Download](https://github.com/vladpazych/Gentitas/releases) `.zip` framework and generator, unpack it in your `Assets` folder, put generator folder into framewrok, and run `Generator.exe`.

or
- Download sources (this repository) and put it in root of your project (same level as `Assets` folder), and [follow instructions](#how-to-run-and-build-from-source).

Current limitations
===================
- Prebuilt releases tested only on Windows 10. If you want to use it on macOS or Linux, please use source version, or build from source yourself.
- Framework can't automaticly download updates.
- Framewrok can't automaticly download generator.

How to run and build from source
======================
`Gentitas.exe` size is too big to be included in your git repo, so it might be good idea to keep sources in your project, so you can rebuild any time.

If you have built version and source version, keep in mind that they use different instances of config and templates. When you build whole framework, source version of templates and config will be written in your Assets folder for built generator to use.

### To work with sources
You need to have  [Node.js](https://nodejs.org/) installed.
```
cd [pathToYourProject]/Gentitas
npm install
```

### To run generator from source
```
npm start
```

### To build only generator (if you already have framework):
```
npm run build
```
### To build whole gentitas framework with configs:
```
npm run build-gentitas-into-project
```


Download Gentitas
=================
Each release contains framework code and generator executable.

[Show releases](https://github.com/vladpazych/Gentitas/releases)
