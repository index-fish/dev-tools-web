import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useTools } from '../store/ToolContext';
import { SECTIONS } from '../store/ToolMetadata';
import { ChevronDown, GripVertical } from 'lucide-react';
import styles from './Sidebar.module.css';
import { clsx } from 'clsx';

const Sidebar: React.FC = () => {
    const {
        activeTool, setActiveTool,
        sectionOrder, setSectionOrder,
        collapsedSections, toggleSection
    } = useTools();

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(sectionOrder);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setSectionOrder(items);
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <div className={styles.logo}>
                    <span className={styles.logoIcon}>🧰</span>
                    <span className={styles.logoText}>DevToolbox</span>
                </div>
            </div>

            <nav className={styles.nav}>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="sidebar">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {sectionOrder.map((id, index) => {
                                    const section = SECTIONS[id];
                                    if (!section) return null;
                                    const isCollapsed = collapsedSections.includes(id);

                                    return (
                                        <Draggable key={id} draggableId={id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={clsx(
                                                        styles.section,
                                                        snapshot.isDragging && styles.dragging,
                                                        isCollapsed && styles.collapsed
                                                    )}
                                                >
                                                    <div className={styles.sectionHeader}>
                                                        <div
                                                            {...provided.dragHandleProps}
                                                            className={styles.handle}
                                                        >
                                                            <GripVertical size={16} />
                                                        </div>

                                                        <div
                                                            className={styles.sectionContent}
                                                            onClick={() => toggleSection(id)}
                                                        >
                                                            <span className={styles.icon}>{section.icon}</span>
                                                            <span className={styles.name}>{section.name}</span>
                                                            <ChevronDown size={16} className={styles.chevron} />
                                                        </div>
                                                    </div>

                                                    {!isCollapsed && (
                                                        <div className={styles.items}>
                                                            {section.tools.map(tool => (
                                                                <button
                                                                    key={tool.id}
                                                                    onClick={() => setActiveTool(tool.id)}
                                                                    className={clsx(
                                                                        styles.item,
                                                                        activeTool === tool.id && styles.itemActive
                                                                    )}
                                                                >
                                                                    {tool.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </nav>
        </aside>
    );
};

export default Sidebar;
