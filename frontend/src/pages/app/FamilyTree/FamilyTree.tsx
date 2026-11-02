import React, { useState, useRef, useCallback, useMemo } from 'react';
import type { FamilyMember, RelationType } from './types';
import { AddRelativeModal } from './AddRelativeModal';
import styles from './FamilyTree.module.css';

const INITIAL_MEMBERS: FamilyMember[] = [
    {
        id: '1',
        name: 'Giovanni Rossi',
        relation: 'Nonno Paterno',
        birthYear: 1930,
        deathYear: 2015,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
        story: 'Ha fondato la falegnameria di famiglia nel 1955.',
        memoriesCount: 12,
        parents: [],
        x: 350,
        y: 120,
    },
    {
        id: '2',
        name: 'Roberto Rossi',
        relation: 'Padre',
        birthYear: 1962,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        story: 'Appassionato di fotografia e viaggi.',
        memoriesCount: 15,
        parents: ['1'],
        x: 350,
        y: 360,
    },
    {
        id: '3',
        name: 'Elena Rossi',
        relation: 'Tu',
        birthYear: 1995,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        story: 'Curatrice dell\'archivio di ricordi.',
        memoriesCount: 24,
        parents: ['2'],
        x: 350,
        y: 600,
    },
];

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';

export default function FamilyTree() {
    const containerRef = useRef<HTMLDivElement>(null);
    const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [zoom, setZoom] = useState<number>(1);
    const [pan, setPan] = useState<{ x: number; y: number }>({ x: 250, y: 60 });
    const [isPanning, setIsPanning] = useState<boolean>(false);
    const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const [members, setMembers] = useState<FamilyMember[]>(INITIAL_MEMBERS);
    const [activePopupNodeId, setActivePopupNodeId] = useState<string | null>(null);
    const [addModalState, setAddModalState] = useState<{
        targetMember: FamilyMember;
        relationType: RelationType;
    } | null>(null);

    // Verifico se un membro ha un partner associato
    const hasPartner = useCallback((member: FamilyMember) => {
        return Boolean(member.partnerId || members.some(m => m.partnerId === member.id));
    }, [members]);

    const handleMouseEnterNode = (nodeId: string) => {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = setTimeout(() => {
            setActivePopupNodeId(nodeId);
        }, 350);
    };

    const handleMouseLeaveNode = () => {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = setTimeout(() => {
            setActivePopupNodeId(null);
        }, 250);
    };

    const handleMouseEnterVignettes = () => {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest(`.${styles.vignettesGroup}`)) return;
        setIsPanning(true);
        setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isPanning) return;
        setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    }, [isPanning, startPan]);

    const handleMouseUp = () => setIsPanning(false);

    const handleWheel = (e: React.WheelEvent) => {
        const zoomFactor = 0.1;
        const newZoom = e.deltaY < 0
            ? Math.min(zoom + zoomFactor, 2.5)
            : Math.max(zoom - zoomFactor, 0.4);
        setZoom(newZoom);
    };

    // Aggiunta Parente con gestione Partner Sconosciuto e relazioni
    const handleAddRelative = (newMemberData: Omit<FamilyMember, 'id' | 'memoriesCount' | 'x' | 'y'>) => {
        if (!addModalState) return;
        const { targetMember, relationType } = addModalState;
        const newId = Date.now().toString();

        // 1. Gestione Partner Sconosciuto se i campi sono vuoti
        let name = newMemberData.name?.trim();
        let avatar = newMemberData.avatar?.trim();

        if (relationType === 'partner' && !name) {
            name = 'Sconosciuto/a';
        } else if (!name) {
            name = 'Sconosciuto/a';
        }

        if (!avatar) {
            avatar = DEFAULT_AVATAR;
        }

        // Posizionamento
        let x = targetMember.x;
        let y = targetMember.y;

        if (relationType === 'parent') {
            y = targetMember.y - 240;
            x = targetMember.x + (Math.random() * 60 - 30);
        } else if (relationType === 'child') {
            y = targetMember.y + 240;
            x = targetMember.x + (Math.random() * 60 - 30);
        } else if (relationType === 'partner') {
            x = targetMember.x + 220;
        }

        // Determina i genitori se aggiungiamo un figlio (sia il target che il suo partner)
        const childParents: string[] = [];
        if (relationType === 'child') {
            childParents.push(targetMember.id);
            if (targetMember.partnerId) {
                childParents.push(targetMember.partnerId);
            }
        }

        const newMember: FamilyMember = {
            ...newMemberData,
            name,
            avatar,
            id: newId,
            memoriesCount: 0,
            parents: relationType === 'child' ? childParents : (newMemberData.parents || []),
            partnerId: relationType === 'partner' ? targetMember.id : undefined,
            x,
            y,
        };

        setMembers((prev) => {
            let updated = [...prev, newMember];

            if (relationType === 'parent') {
                updated = updated.map((m) =>
                    m.id === targetMember.id ? { ...m, parents: [...m.parents, newId] } : m
                );
            } else if (relationType === 'partner') {
                // Imposta la relazione bidirezionale col partner
                updated = updated.map((m) =>
                    m.id === targetMember.id ? { ...m, partnerId: newId } : m
                );
            }

            return updated;
        });

        setAddModalState(null);
    };

    const connections = useMemo(() => {
        const lines: { id: string; x1: number; y1: number; x2: number; y2: number }[] = [];
        members.forEach((child) => {
            child.parents.forEach((parentId) => {
                const parent = members.find((m) => m.id === parentId);
                if (parent) {
                    lines.push({
                        id: `${parent.id}-${child.id}`,
                        x1: parent.x,
                        y1: parent.y + 45,
                        x2: child.x,
                        y2: child.y - 45,
                    });
                }
            });
        });
        return lines;
    }, [members]);

    return (
        <div
            ref={containerRef}
            className={styles.viewport}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
        >
            <div
                className={styles.canvasWorld}
                style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
            >
                <div className={`${styles.backdropOverlay} ${activePopupNodeId ? styles.backdropActive : ''}`} />

                <svg className={styles.svgLayer}>
                    {connections.map((line) => (
                        <path
                            key={line.id}
                            d={`M ${line.x1} ${line.y1} C ${line.x1} ${(line.y1 + line.y2) / 2}, ${line.x2} ${(line.y1 + line.y2) / 2}, ${line.x2} ${line.y2}`}
                            className={styles.connectionLine}
                        />
                    ))}
                </svg>

                {members.map((member) => {
                    const isPopupActive = activePopupNodeId === member.id;
                    const memberHasPartner = hasPartner(member);

                    return (
                        <div
                            key={member.id}
                            style={{ left: `${member.x}px`, top: `${member.y}px` }}
                            className={`${styles.node} ${isPopupActive ? styles.nodeHighlighted : ''}`}
                            onMouseEnter={() => handleMouseEnterNode(member.id)}
                            onMouseLeave={handleMouseLeaveNode}
                        >
                            <div className={styles.avatarWrapper}>
                                <img src={member.avatar} alt={member.name} className={styles.avatar} />
                            </div>

                            <div className={styles.nodeInfo}>
                                <p className={styles.name}>{member.name}</p>
                                <p className={styles.relation}>{member.relation}</p>
                            </div>

                            {/* VIGNETTE FLUTTUANTI */}
                            {isPopupActive && (
                                <div
                                    className={styles.vignettesGroup}
                                    onMouseEnter={handleMouseEnterVignettes}
                                    onMouseLeave={handleMouseLeaveNode}
                                >
                                    {/* Vignetta Genitore */}
                                    <button
                                        className={`${styles.vignetteCard} ${styles.vignetteParent}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActivePopupNodeId(null);
                                            setAddModalState({ targetMember: member, relationType: 'parent' });
                                        }}
                                    >
                                        <div className={styles.vignetteIcon}>👴</div>
                                        <div className={styles.vignetteText}>
                                            <span className={styles.vignetteTitle}>+ Genitore</span>
                                            <span className={styles.vignetteSub}>Aggiungi sopra</span>
                                        </div>
                                    </button>

                                    {/* Vignetta Partner */}
                                    <button
                                        className={`${styles.vignetteCard} ${styles.vignettePartner}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActivePopupNodeId(null);
                                            setAddModalState({ targetMember: member, relationType: 'partner' });
                                        }}
                                    >
                                        <div className={styles.vignetteIcon}>❤️</div>
                                        <div className={styles.vignetteText}>
                                            <span className={styles.vignetteTitle}>+ Partner</span>
                                            <span className={styles.vignetteSub}>Aggiungi a fianco</span>
                                        </div>
                                    </button>

                                    {/* Vignetta Figlio/a (CON VINCOLO PARTNER) */}
                                    <button
                                        className={`${styles.vignetteCard} ${styles.vignetteChild} ${!memberHasPartner ? styles.vignetteDisabled : ''}`}
                                        disabled={!memberHasPartner}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!memberHasPartner) return;
                                            setActivePopupNodeId(null);
                                            setAddModalState({ targetMember: member, relationType: 'child' });
                                        }}
                                        title={!memberHasPartner ? "Devi prima aggiungere un partner per creare un figlio" : ""}
                                    >
                                        <div className={styles.vignetteIcon}>{memberHasPartner ? '👶' : '🔒'}</div>
                                        <div className={styles.vignetteText}>
                                            <span className={styles.vignetteTitle}>+ Figlio/a</span>
                                            <span className={styles.vignetteSub}>
                                                {memberHasPartner ? 'Aggiungi sotto' : 'Serve un partner'}
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {addModalState && (
                <AddRelativeModal
                    targetMember={addModalState.targetMember}
                    relationType={addModalState.relationType}
                    onClose={() => setAddModalState(null)}
                    onSubmit={handleAddRelative}
                />
            )}
        </div>
    );
}