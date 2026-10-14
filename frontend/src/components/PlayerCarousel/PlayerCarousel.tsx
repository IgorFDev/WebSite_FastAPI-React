import { forwardRef, useImperativeHandle, useCallback, useEffect, useRef, useState } from 'react';
import type { Player } from '../../components/PlayerQuestionnaire/PlayerQuestionnaire'
import PlayerQuestionnaire from '../../components/PlayerQuestionnaire/PlayerQuestionnaire'
import './PlayerCarousel.css';

interface PlayerCarouselProps {
  players: Player[];
}

export interface PlayerCarouselHandle {
    prev: () => void;
    next: () => void;
}

type Position = 'center' | 'left' | 'right' | 'hidden-left' | 'hidden-right';

function getOffset(index: number, current: number, total: number): number {
  let o = (index - current) % total;
  if (o < 0) o += total;
  if (o >= total / 2) o -= total;
  return o;
}

function getPosition(offset: number): Position {
  if (offset === 0) return 'center';
  if (offset === 1) return 'right';
  if (offset === -1) return 'left';
  return offset > 0 ? 'hidden-right' : 'hidden-left';
}

const PlayerCarousel = forwardRef<PlayerCarouselHandle, PlayerCarouselProps>(
    function PlayerCarousel({players}, ref) {
        const [current, setCurrent] = useState(0);
        const N = players.length;

        const startXRef = useRef<number | null>(null);

        const move = useCallback(
            (dir: -1 | 1) => setCurrent(prev => (prev + dir + N) % N),
            [N],
        );

        useImperativeHandle(ref, () => ({
            prev: () => move(-1),
            next: () => move(1),
        }), [move]);

        useEffect(() => {
            const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft')  move(-1);
            if (e.key === 'ArrowRight') move(1);
            };
            document.addEventListener('keydown', onKey);
            return () => document.removeEventListener('keydown', onKey);
        }, [move]);

        const onPointerDown = (e: React.PointerEvent) => {
            startXRef.current = e.clientX;
        };
        const onPointerUp = (e: React.PointerEvent) => {
            if (startXRef.current === null) return;
            const dx = e.clientX - startXRef.current;
            if (Math.abs(dx) > 50) move(dx > 0 ? -1 : 1);
            startXRef.current = null;
        };

        const handleCardClick = (index: number) => {
            const offset = getOffset(index, current, N);
            if (offset === -1) move(-1);
            else if (offset === 1) move(1);
        };

        return (
            <div className="carousel-wrapper">
                <div
                    className="carousel"
                    onPointerDown={onPointerDown}
                    onPointerUp={onPointerUp}
                >
                    {players.map((player, i) => {
                        const position = getPosition(getOffset(i, current, N));
                        
                        return(
                            <div
                                key={player.id}
                                className={`card pos-${position}`}
                                onClick={() => handleCardClick(i)}
                            >
                                <PlayerQuestionnaire 
                                    player={player} 
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        )
    }
)

export default PlayerCarousel