# Lobby Component - Usage Examples

## 1. Room Full (Waiting State) --> implemented already
```tsx
<Lobby 
  title="Room Full"
  message="Room nr. 2 under construction. Please wait for a spot in room nr. 1 to become available."
/>
```

## 2. Game Ended (with Score and Actions)
```tsx
import { Button } from "../button";

<Lobby 
  title="Game Over!"
  message="Final Score: 250 points. Great job!"
  icon={trophyImage}
  actions={
    <>
      <Button onClick={handleNewGame}>Play Again</Button>
    </>
  }
/>
```


## 3. Starting Game (Countdown)
```tsx
<Lobby 
  title="Get Ready!"
  message="Game starting in 3 seconds..."
/>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | required | Main heading text |
| `message` | string | required | Description/instruction text |
| `icon` | string | clockImage | Path to icon image |
| `actions` | ReactNode | undefined | Custom buttons or action elements |
