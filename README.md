# react-dom-portal

Very light wrapper around [React.createPortal](https://reactjs.org/docs/portals.html) to provide two features:

## Declarative definitions

Define your portals using components instead of working directly with the DOM (similar to the context api).

```jsx
import { createPortal } from "react-dom-portal";

export const ModalPortal = createPortal();

/**
 * define and insert a portal to allow content to be injected
 * from other components.
 */
const App = () => (
  <div>
    <h1>Lorem ipsum</h1>
    <main>
      <Test />
    </main>
    <ModalPortal.Target></ModalPortal.Target>
  </article>
);

/**
 * child component will inject <h1>Hello ...</h1> into
 * the portal in <App />
 */
const Test = () => (
  <div>
    <h2>Test</h2>

    <ModalPortal.Portal>
      <h1>Hello from Test</h1>
    </ModalPortal.Portal>
  </div>
);
```

## Fallback content

Inspired by Vue.js slots, allow portals to easily define default/fallback content.

```jsx
<ModalPortal.Target>
  <h1>Shown if no components is currently using the Portal</h1>
</ModalPortal.Target>
```
