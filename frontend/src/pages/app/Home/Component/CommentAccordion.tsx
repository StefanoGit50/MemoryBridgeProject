import { motion, AnimatePresence } from 'framer-motion';
import { CommentThread } from '@/shared/Post/component/CommentThread';
import type { Comment } from '@/shared/Post/types';
import styles from './CommentAccordion.module.css';

interface CommentAccordionProps {
    isOpen: boolean;
    comments: Comment[];
    newCommentText: string;
    onChangeText: (text: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    inputPlaceholder: string;
    submitLabel: string;
}

export function CommentAccordion({
                                     isOpen,
                                     comments,
                                     newCommentText,
                                     onChangeText,
                                     onSubmit,
                                     inputPlaceholder,
                                     submitLabel,
                                 }: CommentAccordionProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={styles.wrapper}
                >
                    <CommentThread
                        comments={comments}
                        newCommentText={newCommentText}
                        onChangeText={onChangeText}
                        onSubmit={onSubmit}
                        inputPlaceholder={inputPlaceholder}
                        submitLabel={submitLabel}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}