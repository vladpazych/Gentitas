export default {
  void: 'void',
  int: 'int',
  float: 'float',
  long: 'long',
  bool: 'bool',
  string: 'string',
  type: 'System.Type',

  gameObject: 'UnityEngine.GameObject',

  vector2: 'UnityEngine.Vector2',
  vector3: 'UnityEngine.Vector3',
  vector4: 'UnityEngine.Vector4',
  sprite: 'UnityEngine.Sprite',

  mb: {
    rectTransorm: 'UnityEngine.RectTransform',
    animator: 'UnityEngine.Animator',
    canvas: 'UnityEngine.Canvas',
    canvasGroup: 'UnityEngine.CanvasGroup',
    text: 'UnityEngine.UI.Text',
    image: 'UnityEngine.UI.Image',
    transform: 'UnityEngine.Transform',
    button: 'UnityEngine.UI.Button',
    audioSource: 'UnityEngine.AudioSource',
    spriteRenderer: 'UnityEngine.SpriteRenderer',
    camera: 'UnityEngine.Camera',
    collider2d: 'UnityEngine.Collider2D',
    boxCollider2d: 'UnityEngine.VoxCollider2D',

    releaseGesture: 'TouchScript.Gestures.ReleaseGesture',
    tapGesture: 'TouchScript.Gestures.TapGesture',
    pressGesture: 'TouchScript.Gestures.PressGesture',
    transformGesture: 'TouchScript.Gestures.TransformGesture',
    sortingGroup: 'UnityEngine.Rendering.SortingGroup',
    particleSystem: 'UnityEngine.ParticleSystem',
  },


  dict(key, value) {
    return 'System.Collections.Generic.Dictionary<' + key + ', ' + value + '>'
  },
  list(key) {
    return 'System.Collections.Generic.List<' + key + '>'
  },
  array(key) {
    return key + '[]'
  },
  typeof(t: string) {
    return 'typeof(' + t + ')'
  },
}
