# react-dom-portal

Light wrapper around `React.createPortal` to provide two features:

## Be declarative

```
const ModalPortal = createPortal();

<ModalPortal.Target></ModalPortal.Target>

<ModalPortal.Portal>
  <h1>Hello</h1>
</ModalPortal.Portal>

```

## Fallback content

Inspired by Vue.js slots, allow portals to easily define default/fallback content.

```
<ModalPortal.Target>
  <h1>Fallback content</h1>
</ModalPortal.Target>
```
