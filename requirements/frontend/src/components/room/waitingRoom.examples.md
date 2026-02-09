# WaitingRoom Component - Usage Examples

## 1. Room Full (Waiting State)
```tsx
<WaitingRoom 
  title="Room Full"
  message="Room nr. 2 under construction. Please wait for a spot in room nr. 1 to become available."
/>
```

## 2. Game Ended (with Score and Actions)
```tsx
import { Button } from "../button";

<WaitingRoom 
  title="Game Over!"
  message="Final Score: 250 points. Great job!"
  icon={trophyImage}
  showLoadingDots={false}
  actions={
    <>
      <Button onClick={handleNewGame}>Play Again</Button>
      <Button variant="secondary" onClick={handleExit}>Exit</Button>
    </>
  }
/>
```

## 3. Connection Error
```tsx
<WaitingRoom 
  title="Connection Lost"
  message="Unable to connect to the game server. Please check your internet connection."
  icon={errorImage}
  showLoadingDots={false}
  actions={
    <Button onClick={handleRetry}>Retry Connection</Button>
  }
/>
```

## 4. Starting Game (Countdown)
```tsx
<WaitingRoom 
  title="Get Ready!"
  message="Game starting in 3 seconds..."
  icon={clockImage}
  showLoadingDots={true}
/>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | required | Main heading text |
| `message` | string | required | Description/instruction text |
| `icon` | string | clockImage | Path to icon image |
| `showLoadingDots` | boolean | true | Show animated loading dots |
| `actions` | ReactNode | undefined | Custom buttons or action elements |
