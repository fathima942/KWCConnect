import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MAROON = '#7A1F3D';
const NAVY = '#12355B';
const GOLD = '#C89B3C';

const TEXT = '#18212F';
const MUTED = '#667085';
const BORDER = '#E5E7EB';
const BACKGROUND = '#F8F8F6';

// Web on your PC -> localhost.
// Android emulator -> 10.0.2.2.
// Physical Android phone -> replace with your PC's LAN IP.
const VOICE_BACKEND_URL =
  Platform.OS === 'web'
    ? 'http://localhost:8001'
    : 'http://10.0.2.2:8001';
const V6_API_URL = 'http://192.168.6.21:8003/extract';

type ScreenState =
  | 'ready'
  | 'recording'
  | 'paused'
  | 'processing'
  | 'success'
  | 'error';

type StructuredComplaint = {
  petitioner?: {
    name?: string | null;
    age?: number | null;
    gender?: string | null;
    phone_number?: string | number | null;
    mobile_number?: string | number | null;
    email?: string | null;
    address?: string | null;
    district?: string | null;
    marital_status?: string | null;
  };
  relatives?: unknown[];
  respondents?: Array<{
    name?: string | null;
    gender?: string | null;
    relationship?: string | null;
    mobile_number?: string | number | null;
    address?: string | null;
    district?: string | null;
  }>;
  complaint?: {
    description?: string | null;
    category?: string | null;
    severity?: string | null;
  };
};

export default function ComplaintSpeakScreen() {
  const recorder = useAudioRecorder(
    RecordingPresets.HIGH_QUALITY
  );

  const recorderState = useAudioRecorderState(
    recorder,
    500
  );

  const [screenState, setScreenState] =
    useState<ScreenState>('ready');

  const [errorMessage, setErrorMessage] =
    useState('');

  const [structuredComplaint, setStructuredComplaint] =
    useState<StructuredComplaint | null>(null);

  const pulse = useRef(new Animated.Value(1)).current;
  const ringOne = useRef(new Animated.Value(0)).current;
  const ringTwo = useRef(new Animated.Value(0)).current;

  const pulseAnimation =
    useRef<Animated.CompositeAnimation | null>(null);

  const ringOneAnimation =
    useRef<Animated.CompositeAnimation | null>(null);

  const ringTwoAnimation =
    useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    requestMicrophonePermission();

    return () => {
      stopAnimations();
    };
  }, []);

  useEffect(() => {
    if (screenState === 'recording') {
      startAnimations();
    } else {
      stopAnimations();
    }
  }, [screenState]);

  async function requestMicrophonePermission() {
    try {
      const permission =
        await AudioModule.requestRecordingPermissionsAsync();

      if (!permission.granted) {
        setErrorMessage(
          'Microphone permission is required to record your complaint.'
        );

        setScreenState('error');
        return;
      }

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    } catch (error) {
      console.error(
        'Microphone permission error:',
        error
      );

      setErrorMessage(
        'We could not access your microphone. Please check your device permissions.'
      );

      setScreenState('error');
    }
  }

  function startAnimations() {
    stopAnimations();

    pulseAnimation.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    ringOneAnimation.current = Animated.loop(
      Animated.sequence([
        Animated.timing(ringOne, {
          toValue: 1,
          duration: 1800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(ringOne, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    ringTwoAnimation.current = Animated.loop(
      Animated.sequence([
        Animated.delay(700),
        Animated.timing(ringTwo, {
          toValue: 1,
          duration: 1800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(ringTwo, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.current.start();
    ringOneAnimation.current.start();
    ringTwoAnimation.current.start();
  }

  function stopAnimations() {
    pulseAnimation.current?.stop();
    ringOneAnimation.current?.stop();
    ringTwoAnimation.current?.stop();

    pulse.setValue(1);
    ringOne.setValue(0);
    ringTwo.setValue(0);
  }

  async function startRecording() {
    try {
      setErrorMessage('');

      const permission =
        await AudioModule.requestRecordingPermissionsAsync();

      if (!permission.granted) {
        setErrorMessage(
          'Please allow microphone access to record your complaint.'
        );

        setScreenState('error');
        return;
      }

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });

      await recorder.prepareToRecordAsync();

      recorder.record();

      setScreenState('recording');
    } catch (error) {
      console.error(
        'Recording start error:',
        error
      );

      setErrorMessage(
        'Unable to start recording. Please check microphone permissions and try again.'
      );

      setScreenState('error');
    }
  }

  function pauseRecording() {
    try {
      recorder.pause();
      setScreenState('paused');
    } catch (error) {
      console.error(
        'Pause recording error:',
        error
      );
    }
  }

  function resumeRecording() {
    try {
      recorder.record();
      setScreenState('recording');
    } catch (error) {
      console.error(
        'Resume recording error:',
        error
      );
    }
  }

  async function restartRecording() {
    try {
      await recorder.stop();

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });

      await recorder.prepareToRecordAsync();

      recorder.record();

      setErrorMessage('');
      setScreenState('recording');
    } catch (error) {
      console.error(
        'Restart recording error:',
        error
      );

      setErrorMessage(
        'Could not restart the recording. Please try again.'
      );

      setScreenState('error');
    }
  }

  async function endRecording() {
    try {
      setScreenState('processing');
      stopAnimations();

      await recorder.stop();

      const uri = recorder.uri;

      if (!uri) {
        throw new Error(
          'No recording was created.'
        );
      }

      await processRecording(uri);
    } catch (error) {
      console.error(
        'Recording processing error:',
        error
      );

      setErrorMessage(
        'We could not process your recording. Please try recording again.'
      );

      setScreenState('error');
    }
  }

  async function processRecording(uri: string) {
    const formData = new FormData();

    if (Platform.OS === 'web') {
      const response = await fetch(uri);

      const blob = await response.blob();

      formData.append(
        'audio',
        blob,
        'complaint.webm'
      );
    } else {
      formData.append(
        'audio',
        {
          uri,
          name: 'complaint.m4a',
          type: 'audio/m4a',
        } as any
      );
    }

    const response = await fetch(
      `${VOICE_BACKEND_URL}/process-voice`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        'Voice backend error:',
        errorText
      );

      throw new Error(
        `Voice backend returned ${response.status}`
      );
    }

    const result =
      await response.json();

    console.log(
      'Voice backend result:',
      result
    );

    if (!result?.input) {
      throw new Error(
        'The voice backend did not return a formal complaint.'
      );
    }

    const v6Response = await fetch(V6_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: result.input,
      }),
    });

    const v6ResponseText = await v6Response.text();

    console.log('V6 STATUS:', v6Response.status);
    console.log('V6 RESPONSE:', v6ResponseText);

    if (!v6Response.ok) {
      throw new Error(
        `V6 API returned ${v6Response.status}: ${v6ResponseText}`,
      );
    }

    let v6Result;

    try {
      v6Result = JSON.parse(v6ResponseText);
    } catch {
      throw new Error('V6 API returned invalid JSON.');
    }

    console.log('V6 STRUCTURED COMPLAINT:', v6Result);

    setStructuredComplaint(v6Result);
    setScreenState('success');
  }

  function formatDuration(
    milliseconds: number
  ) {
    const totalSeconds =
      Math.floor(milliseconds / 1000);

    const minutes = Math.floor(
      totalSeconds / 60
    )
      .toString()
      .padStart(2, '0');

    const seconds = (
      totalSeconds % 60
    )
      .toString()
      .padStart(2, '0');

    return `${minutes}:${seconds}`;
  }

  const duration =
    recorderState.durationMillis ?? 0;

  const isRecording =
    screenState === 'recording';

  const isPaused =
    screenState === 'paused';

  const isProcessing =
    screenState === 'processing';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={23}
            color={TEXT}
          />
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>
            FILE A COMPLAINT
          </Text>

          <Text style={styles.title}>
            Speak Your Complaint
          </Text>
        </View>
      </View>

      {/* INSTRUCTIONS */}

      <View style={styles.instructionCard}>
        <View style={styles.instructionIcon}>
          <MaterialCommunityIcons
            name="information-outline"
            size={24}
            color={MAROON}
          />
        </View>

        <View style={styles.instructionContent}>
          <Text style={styles.instructionTitle}>
            Tell us what happened
          </Text>

          <Text style={styles.instructionText}>
            Speak naturally in Malayalam.
            You do not need to use legal
            language. Try to include the
            important details below.
          </Text>

          <View style={styles.detailList}>
            <DetailItem text="What happened?" />

            <DetailItem text="When did it happen?" />

            <DetailItem text="Where did it happen?" />

            <DetailItem
              text="Who was involved, if known?"
            />

            <DetailItem
              text="Any important details or evidence?"
            />
          </View>

          <View style={styles.noteRow}>
            <MaterialCommunityIcons
              name="shield-check-outline"
              size={18}
              color={NAVY}
            />

            <Text style={styles.noteText}>
              You can review and edit the
              complaint before submitting it.
            </Text>
          </View>
        </View>
      </View>

      {/* PROCESSING / RECORDING / SUCCESS */}

      {screenState === 'success' && structuredComplaint ? (
        <View style={styles.successCard}>
          <View style={styles.successIcon}>
            <MaterialCommunityIcons
              name="check"
              size={30}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.successTitle}>
            Your complaint is ready
          </Text>

          <Text style={styles.successSubtitle}>
            We have prepared your complaint from your recording.
            Please review the information before submission.
          </Text>

          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={21}
                color={NAVY}
              />
              <Text style={styles.summaryTitle}>
                Complaint summary
              </Text>
            </View>

            {structuredComplaint.complaint?.category ? (
              <SummaryRow
                label="Category"
                value={structuredComplaint.complaint.category}
              />
            ) : null}

            {structuredComplaint.complaint?.severity ? (
              <SummaryRow
                label="Severity"
                value={structuredComplaint.complaint.severity}
              />
            ) : null}

            {structuredComplaint.petitioner?.name ? (
              <SummaryRow
                label="Complainant"
                value={structuredComplaint.petitioner.name}
              />
            ) : null}

            {structuredComplaint.petitioner?.district ? (
              <SummaryRow
                label="District"
                value={structuredComplaint.petitioner.district}
              />
            ) : null}

            {structuredComplaint.complaint?.description ? (
              <View style={styles.descriptionBlock}>
                <Text style={styles.summaryLabel}>
                  Description
                </Text>
                <Text style={styles.descriptionText}>
                  {structuredComplaint.complaint.description}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.reviewNotice}>
            <MaterialCommunityIcons
              name="shield-check-outline"
              size={20}
              color={NAVY}
            />
            <Text style={styles.reviewNoticeText}>
              Your information is not submitted yet. You will be able
              to review and edit it before submission.
            </Text>
          </View>

          <View style={styles.successActions}>

            {/* REVIEW & EDIT */}
            <Pressable
              onPress={() => {
                if (!structuredComplaint) {
                  return;
                }

                router.push({
                  pathname: '/complaint-review',
                  params: {
                    complaintData: JSON.stringify(structuredComplaint),
                  },
                });
              }}
              style={({ pressed }) => [
                styles.reviewButton,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="file-edit-outline"
                size={21}
                color="#FFFFFF"
              />

              <Text style={styles.reviewButtonText}>
                Review & Edit Complaint
              </Text>
            </Pressable>

            {/* RECORD AGAIN */}
            <Pressable
              onPress={() => {
                setStructuredComplaint(null);
                setErrorMessage('');
                setScreenState('ready');
              }}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="microphone"
                size={20}
                color={MAROON}
              />

              <Text style={styles.secondaryButtonText}>
                Record Again
              </Text>
            </Pressable>

            {/* BACK */}
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backActionButton,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={20}
                color={NAVY}
              />

              <Text style={styles.backActionButtonText}>
                Back to Complaint Options
              </Text>
            </Pressable>

          </View>
        </View>
      ) : (
      <View style={styles.recordingCard}>
        <Text style={styles.statusLabel}>
          {isProcessing
            ? 'PROCESSING YOUR COMPLAINT'
            : isPaused
              ? 'RECORDING PAUSED'
              : isRecording
                ? 'RECORDING'
                : 'READY TO RECORD'}
        </Text>

        <Text style={styles.timer}>
          {formatDuration(duration)}
        </Text>

        {/* MICROPHONE */}

        <View style={styles.microphoneArea}>
          {isRecording && (
            <>
              <Animated.View
                style={[
                  styles.ripple,
                  {
                    opacity:
                      ringOne.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          0.35,
                          0,
                        ],
                      }),

                    transform: [
                      {
                        scale:
                          ringOne.interpolate({
                            inputRange: [
                              0,
                              1,
                            ],
                            outputRange: [
                              1,
                              1.8,
                            ],
                          }),
                      },
                    ],
                  },
                ]}
              />

              <Animated.View
                style={[
                  styles.ripple,
                  {
                    opacity:
                      ringTwo.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          0.28,
                          0,
                        ],
                      }),

                    transform: [
                      {
                        scale:
                          ringTwo.interpolate({
                            inputRange: [
                              0,
                              1,
                            ],
                            outputRange: [
                              1,
                              1.8,
                            ],
                          }),
                      },
                    ],
                  },
                ]}
              />
            </>
          )}

          <Animated.View
            style={[
              styles.microphoneButton,

              isPaused &&
                styles.microphonePaused,

              isProcessing &&
                styles.microphoneProcessing,

              {
                transform: [
                  {
                    scale: pulse,
                  },
                ],
              },
            ]}
          >
            {isProcessing ? (
              <ActivityIndicator
                size="large"
                color="#FFFFFF"
              />
            ) : (
              <MaterialCommunityIcons
                name={
                  isPaused
                    ? 'microphone-off'
                    : 'microphone'
                }
                size={54}
                color="#FFFFFF"
              />
            )}
          </Animated.View>
        </View>

        <Text style={styles.recordingHint}>
          {isProcessing
            ? 'Preparing your complaint. This may take a moment…'
            : isPaused
              ? 'Your recording is paused'
              : isRecording
                ? 'Speak clearly and describe the incident'
                : 'Tap the button below to begin'}
        </Text>

        {/* START */}

        {!isProcessing &&
          !isRecording &&
          !isPaused && (
            <Pressable
              onPress={startRecording}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed &&
                  styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="microphone"
                size={22}
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.primaryButtonText
                }
              >
                Start Recording
              </Text>
            </Pressable>
          )}
        {/* CONTROLS */}

        {(isRecording || isPaused) && (
          <View style={styles.controls}>
            <Pressable
              onPress={
                isRecording
                  ? pauseRecording
                  : resumeRecording
              }
              style={({ pressed }) => [
                styles.controlButton,
                styles.pauseButton,
                pressed &&
                  styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name={
                  isRecording
                    ? 'pause'
                    : 'play'
                }
                size={22}
                color={NAVY}
              />

              <Text
                style={
                  styles.pauseButtonText
                }
              >
                {isRecording
                  ? 'Pause'
                  : 'Resume'}
              </Text>
            </Pressable>

            <Pressable
              onPress={restartRecording}
              style={({ pressed }) => [
                styles.controlButton,
                styles.restartButton,
                pressed &&
                  styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="restart"
                size={22}
                color={MAROON}
              />

              <Text
                style={
                  styles.restartButtonText
                }
              >
                Restart
              </Text>
            </Pressable>

            <Pressable
              onPress={endRecording}
              style={({ pressed }) => [
                styles.controlButton,
                styles.endButton,
                pressed &&
                  styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="check"
                size={22}
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.endButtonText
                }
              >
                End & Process
              </Text>
            </Pressable>
          </View>
        )}

        {/* ERROR */}

        {screenState === 'error' && (
          <View style={styles.errorBox}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={22}
              color={MAROON}
            />

            <Text style={styles.errorText}>
              {errorMessage}
            </Text>
          </View>
        )}
      </View>
      )}

      {/* TRUST */}

      <View style={styles.trustRow}>
        <MaterialCommunityIcons
          name="lock-outline"
          size={18}
          color={NAVY}
        />

        <Text style={styles.trustText}>
          Your recording is used to prepare
          your complaint for review. You
          remain in control before submission.
        </Text>
      </View>
    </ScrollView>
  );
}

function DetailItem({
  text,
}: {
  text: string;
}) {
  return (
    <View style={styles.detailItem}>
      <View style={styles.bullet}>
        <MaterialCommunityIcons
          name="check"
          size={13}
          color="#FFFFFF"
        />
      </View>

      <Text style={styles.detailText}>
        {text}
      </Text>
    </View>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>
        {label}
      </Text>
      <Text style={styles.summaryValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  content: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 50,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: MAROON,
    marginBottom: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: TEXT,
  },

  instructionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 20,
    flexDirection: 'row',
    marginBottom: 20,
  },

  instructionIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F7EAF0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  instructionContent: {
    flex: 1,
  },

  instructionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT,
    marginBottom: 7,
  },

  instructionText: {
    fontSize: 14,
    lineHeight: 21,
    color: MUTED,
    marginBottom: 14,
  },

  detailList: {
    gap: 9,
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  bullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: MAROON,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  detailText: {
    flex: 1,
    fontSize: 13,
    color: TEXT,
  },

  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F5F8',
    borderRadius: 10,
    padding: 10,
    marginTop: 16,
  },

  noteText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    lineHeight: 18,
    color: NAVY,
  },

  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 30,
    alignItems: 'center',
    minHeight: 500,
  },

  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: MAROON,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: TEXT,
    textAlign: 'center',
    marginBottom: 8,
  },

  successSubtitle: {
    maxWidth: 620,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 21,
    color: MUTED,
    marginBottom: 22,
  },

  summaryCard: {
    width: '100%',
    maxWidth: 720,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 18,
  },

  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  summaryTitle: {
    marginLeft: 9,
    fontSize: 16,
    fontWeight: '800',
    color: TEXT,
  },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: '#E9EDF2',
  },

  summaryLabel: {
    width: 105,
    fontSize: 12,
    fontWeight: '700',
    color: MUTED,
  },

  summaryValue: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: TEXT,
    fontWeight: '600',
  },

  descriptionBlock: {
    borderTopWidth: 1,
    borderTopColor: '#E9EDF2',
    paddingTop: 12,
    marginTop: 2,
  },

  descriptionText: {
    fontSize: 14,
    lineHeight: 21,
    color: TEXT,
    marginTop: 5,
  },

  reviewNotice: {
    width: '100%',
    maxWidth: 720,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F2F5F8',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },

  reviewNoticeText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 12,
    lineHeight: 18,
    color: NAVY,
  },

  successActions: {
    width: '100%',
    maxWidth: 720,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 22,
  },
  reviewButton: {
    width: '100%',
    minHeight: 52,
    paddingHorizontal: 24,
    borderRadius: 13,
    backgroundColor: MAROON,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  reviewButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  backActionButton: {
    minHeight: 50,
    paddingHorizontal: 22,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  backActionButtonText: {
    color: NAVY,
    fontSize: 14,
    fontWeight: '700',
  },

  secondaryButton: {
    minHeight: 50,
    paddingHorizontal: 22,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#E6C7D2',
    backgroundColor: '#FDF5F8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  secondaryButtonText: {
    color: MAROON,
    fontSize: 14,
    fontWeight: '800',
  },

  recordingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 30,
    alignItems: 'center',
    minHeight: 500,
    justifyContent: 'center',
  },

  statusLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.3,
    color: MAROON,
  },

  timer: {
    fontSize: 36,
    fontWeight: '800',
    color: TEXT,
    marginTop: 8,
    fontVariant: ['tabular-nums'],
  },

  microphoneArea: {
    width: 230,
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },

  ripple: {
    position: 'absolute',
    width: 145,
    height: 145,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: MAROON,
    backgroundColor: '#F7EAF0',
  },

  microphoneButton: {
    width: 145,
    height: 145,
    borderRadius: 73,
    backgroundColor: MAROON,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  microphonePaused: {
    backgroundColor: NAVY,
  },

  microphoneProcessing: {
    backgroundColor: GOLD,
  },

  recordingHint: {
    maxWidth: 450,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 21,
    color: MUTED,
    marginBottom: 22,
  },

  primaryButton: {
    minHeight: 52,
    paddingHorizontal: 28,
    borderRadius: 13,
    backgroundColor: MAROON,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  controls: {
    width: '100%',
    maxWidth: 620,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },

  controlButton: {
    minHeight: 48,
    paddingHorizontal: 17,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderWidth: 1,
  },

  pauseButton: {
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },

  restartButton: {
    borderColor: '#E6C7D2',
    backgroundColor: '#FDF5F8',
  },

  endButton: {
    borderColor: MAROON,
    backgroundColor: MAROON,
  },

  pauseButtonText: {
    color: NAVY,
    fontSize: 14,
    fontWeight: '700',
  },

  restartButtonText: {
    color: MAROON,
    fontSize: 14,
    fontWeight: '700',
  },

  endButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },

  errorBox: {
    width: '100%',
    maxWidth: 600,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4F6',
    borderWidth: 1,
    borderColor: '#E8B9C7',
    borderRadius: 12,
    padding: 13,
    marginTop: 18,
  },

  errorText: {
    flex: 1,
    marginLeft: 9,
    color: MAROON,
    fontSize: 13,
    lineHeight: 19,
  },

  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    paddingHorizontal: 20,
  },

  trustText: {
    flex: 1,
    maxWidth: 650,
    marginLeft: 8,
    textAlign: 'center',
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
  },
});
