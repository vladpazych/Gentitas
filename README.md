# Gentitas - Code Generator for Entitas

Gentitas is a fast code generator for Entitas. It watches your `Assets` folder for `.gentitas.cs` files and generates Entitas API from them.

---

### **[» Download](#download-gentitas)**
### **[» How to use](#how-to-use)**
### **[» Ask a question / Report a bug](issues-new)**
### **[» Wiki and examples](wiki)**
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
            var RabbitUnit = Component<float>().GroupSingle;
            var Fast = Component();
            var Speed = Component<float>().Group;

            var RabbitWithName = Group(Matcher.All(Rabbit, RabbitName));
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
    entity.fast = true;
    entity.speed = 10f;

    // Groups
    var application = Contexts.state.applicationEntity;
    var speedGroup = Contexts.state.speedGroup;
    var speedEntities = Contexts.state.speedEntities;
    var rabbitUnit Contexts.state.rabbitUnit;

    // Index
    var numberOfRabbitsWithNameSteve = Contexts.state.fastRabbitNameIndex.GetCount("Steve");
    var rabbitsWithNameSteve = Contexts.state.fastRabbitNameIndex.Find("Steve");
    var rabbitWithNameSteve = Contexts.state.fastRabbitNameIndex.FindSingle("Steve");
}
```

How to use
==========
- [Download](https://github.com/vladpazych/Gentitas/releases) latest version
- Move downloaded `Gentitas` folder into your `Assets` folder
- Run `Tools/Entitas/Check System For Gentitas`
- If you don't have [Node.js](https://nodejs.org/) installed - it will tell you
- Run `Tools/Entitas/Install Gentitas Dependecies`
- Run `Tools/Entitas/Start Gentitas Generator`
- Create `[AnyFileName].gentitas.cs` somewhere in your `Assets` folder
- Add declaration code from [First glimpse](#first-glimpse) and save file
- Check your `Assets/Generated` folder
- That's it

Download Gentitas
=================
Each release contains framework code and generator executable.

[Show releases](https://github.com/vladpazych/Gentitas/releases)

Contribute
==========
The project is hosted on [GitHub][repo] where you can [report issues][issues-new], fork the project and [submit pull requests][pulls].

Feel free to [suggest your ideas][issues-new].


Maintainer
==========
* [@vladpazych](https://github.com/vladpazych)

[issues-new]: https://github.com/vladpazych/Gentitas/issues/new "New issue"
[wiki]: https://github.com/vladpazych/Gentitas/wiki "Entitas Wiki"
[wiki-install]: https://github.com/vladpazych/Gentitas/wiki/Install-and-run "Install and run"
[releases]: https://github.com/vladpazych/Gentitas/releases "Releases"
[repo]: https://github.com/vladpazych/Gentitas "Repository"
[pulls]: https://github.com/vladpazych/Gentitas/pulls "New pull request"
