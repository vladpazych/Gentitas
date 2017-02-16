# Gentitas - Code Generator for Entitas

Gentitas is a fast and easy to extend code generator, that takes data created by your TypeScript code, and generates C# API source code and API Reference Documentation as static HTML. 

---

### **[» Download](#download-gentitas)**
### **[» Install and run][wiki-install]**
### **[» Ask a question][issues-new]**
### **[» Wiki and examples][wiki]**

---

First glimpse
=============
```typescript
// Components
application = ucomponent()
loaded = component()
action = component({
    value: alias.string
}).Contexts(contexts.meta)

// Systems
processActionEntity = reactiveSystem(contexts.meta)
    .Trigger(Matcher.AllOf(components.action), EventType.onEntered)
    .Trigger(Matcher.AllOf(components.action).NoneOf(components.resolved), EventType.onEntered)
    .Ensure(components.action)
    .Exclude(components.resolved)

// Views
someElement = view()
    .PropEntity(contexts.core, classesCommon.someOtherService.GetComponent())
    .PropGO('Body', 'body')
    .PropMB(alias.mb.animator)
    .PropMBExternal(alias.mb.animator, "Body/Common", "commonAnimator")
    .PropContext(contexts.meta)
    .Method("Rotate", alias.void, { direction: alias.int })
    .MethodEditor("RotateLeft")
    .MethodEditor("RotateRight")
    .Component()
```


Overview
========
You can declare all interfaces, classes, properties, methods inside Gentitas, and only implement logic in C#.

Or you can use it for only ECS components and contexts.

You can easily extend handlebars templates to add some sugar in your API.

Out of the box it can generate:
- Contexts
- Components
- SystemChains
- Interfaces

Bases or partials:
- Systems
- Classes
- Views

[Read more...][wiki]


Download Gentitas
=================
Each release is published with zip files containing all source files you need.

[Show releases][releases]


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