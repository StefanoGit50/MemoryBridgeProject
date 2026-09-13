import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CreateMemoryScreenProps, MemoryDraft } from '@/shared/Post/types';
import { CREATE_MEMORY_CONTENT } from '@/shared/Post/content';
import { useCreateMemoryWizard } from '@/shared/Post/hook/useCreateMemoryWizard';
import { useMediaSelection } from '@/shared/Post/hook/useMediaSelection';
import { useAudioRecording } from '@/shared/Post/hook/useAudioRecording';
import { usePeopleTags } from '@/shared/Post/hook/usePeopleTags';
import styles from './Creatememoryscreen.module.css';

const { stepIndicator, exitButtonLabel, contentTypeStep, detailsStep, processing, previewStep } =
    CREATE_MEMORY_CONTENT;

// Altezze delle barre dell'onda animata in fase di registrazione (decorative, non dati reali).
const RECORDING_WAVE_HEIGHTS = [18, 32, 12, 28, 40, 20, 36, 14, 25, 38, 16, 30];

// Altezze statiche delle barre dell'onda nell'anteprima del post pubblicato (decorative).
const PREVIEW_WAVE_HEIGHTS = [
    8, 16, 24, 12, 28, 36, 18, 32, 40, 22, 14, 30, 38, 20, 10, 26, 34, 16, 28, 32, 14, 22, 18, 8,
];

function StepLabel({ active, activeClass, children }: { active: boolean; activeClass: string; children: React.ReactNode }) {
    return (
        <motion.span
            animate={{ scale: active ? 1.1 : 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ display: 'inline-block', transformOrigin: 'left center' }}
            className={active ? activeClass : styles.stepLabel}
        >
            {children}
        </motion.span>
    );
}


export function CreateMemoryScreen({ onClose, onSave }: CreateMemoryScreenProps) {
    const { step, isProcessing, goToStep, goToPreviewWithProcessing } = useCreateMemoryWizard();
    const media = useMediaSelection();
    const audio = useAudioRecording((file, url) => media.setMedia(file, url));
    const people = usePeopleTags();

    const stepVariants = {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 },
    };
    const stepTransition = { duration: 0.3, ease: 'easeInOut' } as const;

    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');


    function handleSelectContentType(type: 'audio' | 'video' | 'immagine') {
        media.setContentType(type);
        if (type === 'audio') {
            audio.resetRecordingState();
            media.resetMedia();
        } else {
            audio.resetRecordingState();
        }
    }

    function handleResetAudioRecording() {
        audio.resetRecordingState();
        media.resetMedia();
    }

    const isStep1Valid = Boolean(
        (media.contentType === 'audio' && audio.audioRecorded) ||
        (media.contentType === 'video' && media.selectedFile) ||
        (media.contentType === 'immagine' && media.selectedFile) ||
        media.previewUrl
    );

    function handleSubmit() {
        const memoryData: MemoryDraft = {
            type: media.contentType,
            file: media.selectedFile,
            previewUrl: media.previewUrl,
            location,
            people: people.peopleTags,
            description,
            createdAt: new Date().toISOString(),
        };
        onSave?.(memoryData);
    }

    return (
        <div
            className={styles.modalOverlay}
            onClick={(e) => {
                // chiude solo se si clicca sullo sfondo, non sul contenuto
                if (e.target === e.currentTarget) onClose?.();
            }}
        >
            <motion.div className={styles.fullPageLayout}>
                {/* TOP HEADER */}
                <header className={styles.topHeader}>
                    <div className={styles.stepIndicator}>
                        <StepLabel active={step === 1} activeClass={styles.stepLabelActive}>
                            {stepIndicator.step1}
                        </StepLabel>
                        <span className={styles.stepSeparator}> • </span>
                        <StepLabel active={step === 2} activeClass={styles.stepLabelActive}>
                            {stepIndicator.step2}
                        </StepLabel>
                        <span className={styles.stepSeparator}> • </span>
                        <StepLabel active={step === 3} activeClass={styles.stepLabelActiveIris}>
                            {stepIndicator.step3}
                        </StepLabel>
                    </div>
                    {onClose && (
                        <button className={styles.exitBtn} onClick={onClose}>
                            {exitButtonLabel}
                        </button>
                    )}
                </header>

                {/* MAIN CONTAINER */}
                <main className={styles.bodyContainer}>
                    <AnimatePresence mode="wait">
                        {/* STEP 1 */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                variants={stepVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={stepTransition}
                                className={styles.step1CenterBox}
                            >
                                <h1 className={styles.titleText}>{contentTypeStep.title}</h1>

                                <div className={styles.iconGroup}>
                                    <div className={styles.optionItem} onClick={() => handleSelectContentType('audio')}>
                                        <motion.button
                                            whileHover={{ scale: 1.08 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`${styles.roundIconBtn} ${styles.roundIconBtnAudio} ${
                                                media.contentType === 'audio' ? styles.roundIconBtnSelected : ''
                                            }`}
                                        >
                                            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                                                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                                <line x1="12" y1="19" x2="12" y2="22" />
                                            </svg>
                                        </motion.button>
                                        <span
                                            className={`${styles.iconText} ${
                                                media.contentType === 'audio' ? styles.iconTextActive : ''
                                            }`}
                                        >
                                            {contentTypeStep.typeLabels.audio}
                                        </span>
                                    </div>

                                    <div className={styles.optionItem} onClick={() => handleSelectContentType('video')}>
                                        <motion.button
                                            whileHover={{ scale: 1.08 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`${styles.roundIconBtn} ${styles.roundIconBtnVideo} ${
                                                media.contentType === 'video' ? styles.roundIconBtnSelected : ''
                                            }`}
                                        >
                                            <div className={styles.recBadgeText}>•REC</div>
                                        </motion.button>
                                        <span
                                            className={`${styles.iconText} ${
                                                media.contentType === 'video' ? styles.iconTextActive : ''
                                            }`}
                                        >
                                            {contentTypeStep.typeLabels.video}
                                        </span>
                                    </div>

                                    <div
                                        className={styles.optionItem}
                                        onClick={() => handleSelectContentType('immagine')}
                                    >
                                        <motion.button
                                            whileHover={{ scale: 1.08 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`${styles.roundIconBtn} ${styles.roundIconBtnImage} ${
                                                media.contentType === 'immagine' ? styles.roundIconBtnSelected : ''
                                            }`}
                                        >
                                            <svg width="36" height="36" viewBox="0 0 24 24" fill="#2563eb">
                                                <rect x="3" y="3" width="18" height="18" rx="3" fill="#2563eb" />
                                                <circle cx="8.5" cy="8.5" r="1.5" fill="#ffffff" />
                                                <path d="M21 15l-5-5L5 21" stroke="#ffffff" strokeWidth="2" />
                                            </svg>
                                        </motion.button>
                                        <span
                                            className={`${styles.iconText} ${
                                                media.contentType === 'immagine' ? styles.iconTextActive : ''
                                            }`}
                                        >
                                            {contentTypeStep.typeLabels.immagine}
                                        </span>
                                    </div>
                                </div>

                                <hr className={styles.blueLine} />

                                <div className={styles.dynamicSection}>
                                    {media.contentType === 'audio' && (
                                        <div className={styles.actionBoxInner}>
                                            {!audio.isRecording && !audio.audioRecorded && (
                                                <>
                                                    <p className={styles.actionPrompt}>{contentTypeStep.audio.prompt}</p>
                                                    <button onClick={audio.startRecording} className={styles.startRecordMicBtn}>
                                                        {contentTypeStep.audio.startButton}
                                                    </button>
                                                </>
                                            )}

                                            {audio.isRecording && (
                                                <div className={styles.voiceRecordContainer}>
                                                    <motion.div
                                                        animate={{ scale: [1, 1.25, 1], opacity: [1, 0.4, 1] }}
                                                        transition={{ repeat: Infinity, duration: 0.8 }}
                                                        className={styles.recordingRedDot}
                                                    />
                                                    <span className={styles.timerText}>
                                                        {audio.formatTime(audio.recordingTime)}
                                                    </span>

                                                    <div className={styles.waveformBox}>
                                                        {RECORDING_WAVE_HEIGHTS.map((h, i) => (
                                                            <motion.div
                                                                key={i}
                                                                animate={{ height: [8, h, 10] }}
                                                                transition={{
                                                                    repeat: Infinity,
                                                                    duration: 0.4 + (i % 4) * 0.12,
                                                                    repeatType: 'reverse',
                                                                }}
                                                                className={styles.waveBar}
                                                            />
                                                        ))}
                                                    </div>

                                                    <button onClick={audio.stopRecording} className={styles.stopRecordBtn}>
                                                        {contentTypeStep.audio.stopButton}
                                                    </button>
                                                </div>
                                            )}

                                            {audio.audioRecorded && media.previewUrl && (
                                                <div className={styles.recordedAudioBox}>
                                                    <p className={styles.recordedAudioLabel}>
                                                        {contentTypeStep.audio.recordedLabel}
                                                    </p>
                                                    <audio src={media.previewUrl} controls className={styles.audioPlayerStyle} />
                                                    <button onClick={handleResetAudioRecording} className={styles.reRecordBtn}>
                                                        {contentTypeStep.audio.reRecordButton}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {media.contentType === 'video' && (
                                        <div className={styles.actionBoxInner}>
                                            <p className={styles.actionPrompt}>{contentTypeStep.video.prompt}</p>
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={media.handleFileChange}
                                                id="video-upload-full"
                                                style={{ display: 'none' }}
                                            />
                                            <label htmlFor="video-upload-full" className={styles.blueUploadBtn}>
                                                {contentTypeStep.video.uploadButton}
                                            </label>
                                            {media.selectedFile && (
                                                <p className={styles.selectedFileLabel}>
                                                    {contentTypeStep.video.selectedPrefix} {media.selectedFile.name}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {media.contentType === 'immagine' && (
                                        <div className={styles.actionBoxInner}>
                                            <p className={styles.actionPrompt}>{contentTypeStep.immagine.prompt}</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={media.handleFileChange}
                                                id="image-upload-full"
                                                style={{ display: 'none' }}
                                            />
                                            <label htmlFor="image-upload-full" className={styles.blueUploadBtn}>
                                                {contentTypeStep.immagine.uploadButton}
                                            </label>
                                            {media.previewUrl && (
                                                <img src={media.previewUrl} alt="Anteprima" className={styles.imagePreview} />
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.bottomNextWrapper}>
                                    <button
                                        onClick={() => goToStep(2)}
                                        disabled={!isStep1Valid}
                                        className={styles.blueNextBtn}
                                    >
                                        {contentTypeStep.nextButton}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2 */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                variants={stepVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={stepTransition}
                                className={styles.step2FullGrid}
                            >
                                <div className={styles.previewPanel}>
                                    <div className={styles.mediaContainer}>
                                        {media.contentType === 'immagine' && media.previewUrl && (
                                            <img src={media.previewUrl} alt="Ricordo" className={styles.fullMediaImg} />
                                        )}
                                        {media.contentType === 'video' && (
                                            <div className={styles.placeholderMediaText}>📹 Video Caricato</div>
                                        )}
                                        {media.contentType === 'audio' && media.previewUrl && (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                                                <div className={styles.placeholderMediaText}>🎙️ Nota Vocale Registrata</div>
                                                <audio src={media.previewUrl} controls style={{ maxWidth: '300px' }} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.editorPanel}>
                                    <h2 className={styles.leftTitleText}>{detailsStep.title}</h2>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.fieldLabel}>{detailsStep.locationLabel}</label>
                                        <input
                                            type="text"
                                            placeholder={detailsStep.locationPlaceholder}
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className={styles.textInput}
                                        />
                                    </div>

                                    <div className={styles.inputGroup} style={{ position: 'relative' }}>
                                        <label className={styles.fieldLabel}>{detailsStep.peopleLabel}</label>

                                        <div className={styles.personSearchBox}>
                                            <span className={styles.personSearchIcon}>🔍</span>
                                            <input
                                                type="text"
                                                placeholder="Cerca un familiare da aggiungere..."
                                                value={people.customPerson}
                                                onChange={(e) => people.setCustomPerson(e.target.value)}
                                                onKeyDown={people.handleCustomPersonKeyDown}
                                                className={styles.personSearchInput}
                                            />
                                        </div>

                                        {people.customPerson.trim().length > 0 && (
                                            <div className={styles.personSuggestionsDropdown}>
                                                {detailsStep.quickPeopleOptions.filter((name) =>
                                                    name.toLowerCase().includes(people.customPerson.trim().toLowerCase()) &&
                                                    !people.peopleTags.includes(name)
                                                ).length === 0 ? (
                                                    <div className={styles.personNoResults}>
                                                        Nessun familiare trovato con questo nome
                                                    </div>
                                                ) : (
                                                    detailsStep.quickPeopleOptions
                                                        .filter((name) =>
                                                            name.toLowerCase().includes(people.customPerson.trim().toLowerCase()) &&
                                                            !people.peopleTags.includes(name)
                                                        )
                                                        .map((name) => (
                                                            <button
                                                                key={name}
                                                                type="button"
                                                                className={styles.personResultRow}
                                                                onClick={() => {
                                                                    people.toggleQuickTag(name);
                                                                    people.setCustomPerson('');
                                                                }}
                                                            >
                                                                <span className={styles.personResultAvatar}>👤</span>
                                                                <span className={styles.personResultName}>{name}</span>
                                                                <span className={styles.personResultAdd}>+ Aggiungi</span>
                                                            </button>
                                                        ))
                                                )}
                                            </div>
                                        )}

                                        {people.peopleTags.length > 0 && (
                                            <div className={styles.tagCloudRow}>
                                                {people.peopleTags.map((tag) => (
                                                    <button
                                                        key={tag}
                                                        type="button"
                                                        onClick={() => people.toggleQuickTag(tag)}
                                                        className={styles.personChipSelected}
                                                    >
                                                        <span className={styles.personChipAvatar}>👤</span>
                                                        {tag}
                                                        <span className={styles.personChipRemove}>✕</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className={`${styles.inputGroup} ${styles.descriptionInputGroup}`}>
                                        <label className={styles.fieldLabel}>{detailsStep.descriptionLabel}</label>
                                        <textarea
                                            placeholder={detailsStep.descriptionPlaceholder}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className={styles.giganticTextArea}
                                        />
                                    </div>

                                    <div className={styles.actionFooter}>
                                        <button onClick={() => goToStep(1)} className={styles.grayBackBtn}>
                                            {detailsStep.backButton}
                                        </button>
                                        <button onClick={goToPreviewWithProcessing} className={styles.orangeIrisNextBtn}>
                                            {detailsStep.nextButton}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3 */}
                        {step === 3 && (
                            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                {isProcessing ? (
                                    <motion.div
                                        key="processing"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={styles.processingFullWrapper}
                                    >
                                        <motion.div
                                            animate={{ rotate: 360, scale: [1, 1.12, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className={styles.processingIcon}
                                        >
                                            🦉
                                        </motion.div>
                                        <h2 className={styles.processingTitle}>{processing.title}</h2>
                                        <p className={styles.processingSub}>{processing.subtitle}</p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="step3"
                                        variants={stepVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        transition={stepTransition}
                                        style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                                    >
                                        <div className={styles.gridThreeColumns}>
                                            {/* COL 1 */}
                                            <div className={styles.columnCard}>
                                                <div className={styles.columnHeader}>
                                                    <span className={styles.columnHeaderTitle}>
                                                        {previewStep.postColumn.header}
                                                    </span>
                                                </div>

                                                <div className={styles.postCardOuter}>
                                                    <div className={styles.postHeaderRow}>
                                                        <div className={styles.userAvatar}>👤</div>
                                                        <div>
                                                            <div className={styles.postAuthorName}>
                                                                {previewStep.currentUserName}
                                                            </div>
                                                            {people.peopleTags.length > 0 && (
                                                                <div className={styles.postConLine}>
                                                                    con{' '}
                                                                    {people.peopleTags.map((tag, idx) => (
                                                                        <span key={tag}>
                                                                        <span className={styles.postConName}>{tag}</span>
                                                                            {idx < people.peopleTags.length - 1 ? ', ' : ''}
                                                                    </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {location && (
                                                                <div className={styles.postAuthorLocation}>
                                                                    📍 {location}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className={styles.postDescriptionArea}>
                                                        {description ? (
                                                            <>
                                                                <p className={styles.postTextContent}>{description}</p>
                                                            </>
                                                        ) : (
                                                            <p className={styles.postTextPlaceholder}>
                                                                {previewStep.postColumn.noDescriptionPlaceholder}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className={styles.postImageContainer}>
                                                        {media.contentType === 'immagine' && media.previewUrl && (
                                                            <img src={media.previewUrl} alt="Post preview" className={styles.postImage} />
                                                        )}

                                                        {media.contentType === 'audio' && media.previewUrl && (
                                                            <div className={styles.audioWireframeContainer}>
                                                                <audio
                                                                    ref={audio.previewAudioRef}
                                                                    src={media.previewUrl}
                                                                    onEnded={() => {}}
                                                                    style={{ display: 'none' }}
                                                                />

                                                                <div className={styles.staticWaveformRow}>
                                                                    {PREVIEW_WAVE_HEIGHTS.map((h, idx) => (
                                                                        <div
                                                                            key={idx}
                                                                            className={styles.waveformBarItem}
                                                                            style={{ height: `${h}px` }}
                                                                        />
                                                                    ))}
                                                                </div>

                                                                <button onClick={audio.togglePlayPreview} className={styles.playAudioBigBtn}>
                                                                    {audio.isPlayingPreview
                                                                        ? previewStep.postColumn.pauseAudioButton
                                                                        : previewStep.postColumn.playAudioButton}
                                                                </button>
                                                            </div>
                                                        )}

                                                        {media.contentType === 'video' && (
                                                            <div className={styles.videoPreviewLabel}>
                                                                {previewStep.postColumn.videoPreviewLabel}
                                                            </div>
                                                        )}

                                                        {!media.previewUrl && (
                                                            <div className={styles.noMediaLabel}>
                                                                {previewStep.postColumn.noMediaLabel}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className={styles.postFooterBar}>
                                                        <span className={styles.postFooterIcon}>❤️</span>
                                                        <span className={styles.postFooterIcon}>💬</span>
                                                        <span className={styles.postFooterIcon}>🔗</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* COL 2 */}
                                            <div className={styles.columnCard}>
                                                <div className={styles.columnHeader}>
                                                    <span className={styles.columnHeaderTitle}>
                                                        {previewStep.editorColumn.header}
                                                    </span>
                                                </div>

                                                <p className={styles.columnSubtitle}>{previewStep.editorColumn.subtitle}</p>

                                                <textarea
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    placeholder={previewStep.editorColumn.descriptionPlaceholder}
                                                    className={styles.bigColumnTextArea}
                                                />
                                            </div>

                                            {/* COL 3 */}
                                            <div className={`${styles.columnCard} ${styles.irisColumnCard}`}>
                                                <div className={styles.columnHeader}>
                                                    <div className={styles.irisAvatarTitle}>🦉</div>
                                                    <span className={`${styles.columnHeaderTitle} ${styles.irisColumnHeaderTitle}`}>
                                                        {previewStep.irisColumn.header}
                                                    </span>
                                                </div>

                                                <p className={styles.columnSubtitle}>{previewStep.irisColumn.subtitle}</p>

                                                <div className={styles.irisTipsStack}>
                                                    {previewStep.irisColumn.tips.map((tip, idx) => (
                                                        <div key={idx} className={styles.tipCardStatic}>
                                                            <div className={styles.tipIcon}>💡</div>
                                                            <div className={styles.tipText}>{tip}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* FOOTER */}
                                        <div className={styles.bottomBarGlobal}>
                                            <button onClick={() => goToStep(2)} className={styles.grayBackBtn}>
                                                {previewStep.backButton}
                                            </button>

                                            <button onClick={handleSubmit} className={styles.publishBtnHuge}>
                                                {previewStep.publishButton}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </AnimatePresence>
                </main>
            </motion.div>

    </div>

    );
}

export default CreateMemoryScreen;
