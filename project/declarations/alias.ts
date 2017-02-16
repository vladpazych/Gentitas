export default {
    void: 'void',
    int: 'int',
    float: 'float',
    bool: 'bool',
    string: 'string',   
    
    vector2: 'UnityEngine.Vector2',
    vector3: 'UnityEngine.Vector3',

    mb: {
        animator: "UnityEngine.Animator",
        canvas: "UnityEngine.Canvas",
        canvasGroup: "UnityEngine.CanvasGroup",
        text: "UnityEngine.UI.Text",
        transform: "UnityEngine.Transform",
        button: "UnityEngine.UI.Button",
        audioSource: "UnityEngine.AudioSource",
        spriteRenderer: "UnityEngine.SpriteRenderer",
        camera: "UnityEngine.Camera",
        collider2d: "UnityEngine.Collider2D",
        boxCollider2d: "UnityEngine.VoxCollider2D",
    },
    
    dict: function (key, value) {
        return "System.Collections.Generic.Dictionary<" + key + ", " + value + ">"
    },
    list: function (key) {
        return "System.Collections.Generic.List<" + key + ">"
    },
};