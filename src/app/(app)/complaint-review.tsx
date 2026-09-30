import React, { useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import {
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

import { db, auth } from '@/services/firebase';

const MAROON = '#7A1F3D';
const NAVY = '#12355B';
const GOLD = '#C89B3C';
const INK = '#172033';
const MUTED = '#64748B';
const BORDER = '#E2E8F0';
const SURFACE = '#FFFFFF';
const PAGE = '#F7F5F3';
const SOFT = '#F4F7FA';

type Respondent = {
  name: string;
  gender: string;
  relationship: string;
  mobile_number: string;
  address: string;
  district: string;
};

type ComplaintDraft = {
  petitioner: {
    name: string;
    age: string;
    gender: string;
    phone_number: string;
    mobile_number: string;
    email: string;
    address: string;
    district: string;
    marital_status: string;
  };
  respondent: Respondent;
  complaint: {
    description: string;
    category: string;
    severity: string;
  };
  caseType: string;
  districtOfRespondent: string;
  relation: string;
  uploadScannedComplaint: string;
  petitionDetails: Record<string, string>;
  confirmations: Record<string, string>;
  declaration: boolean;
};

const emptyDraft: ComplaintDraft = {
  petitioner: {
    name: '',
    age: '',
    gender: '',
    phone_number: '',
    mobile_number: '',
    email: '',
    address: '',
    district: '',
    marital_status: '',
  },

  respondent: {
    name: '',
    gender: '',
    relationship: '',
    mobile_number: '',
    address: '',
    district: '',
  },

  complaint: {
    description: '',
    category: '',
    severity: '',
  },

  caseType: '',
  districtOfRespondent: '',
  relation: '',
  uploadScannedComplaint: 'No',

  petitionDetails: {},
  confirmations: {},

  declaration: false,
};

const parseDraft = (raw?: string): ComplaintDraft => {
  if (!raw) {
    return emptyDraft;
  }

  try {
    const parsed = JSON.parse(raw);

    const petitioner = parsed?.petitioner ?? {};

    const respondents = Array.isArray(parsed?.respondents)
      ? parsed.respondents
      : [];

    const respondent = respondents[0] ?? {};

    return {
      ...emptyDraft,

      petitioner: {
        ...emptyDraft.petitioner,

        name: petitioner.name ?? '',

        age:
          petitioner.age != null
            ? String(petitioner.age)
            : '',

        gender: petitioner.gender ?? '',

        phone_number:
          petitioner.phone_number != null
            ? String(petitioner.phone_number)
            : '',

        mobile_number:
          petitioner.mobile_number != null
            ? String(petitioner.mobile_number)
            : '',

        email: petitioner.email ?? '',

        address: petitioner.address ?? '',

        district: petitioner.district ?? '',

        marital_status:
          petitioner.marital_status ?? '',
      },

      respondent: {
        ...emptyDraft.respondent,

        name: respondent.name ?? '',

        gender: respondent.gender ?? '',

        relationship:
          respondent.relationship ?? '',

        mobile_number:
          respondent.mobile_number != null
            ? String(respondent.mobile_number)
            : '',

        address: respondent.address ?? '',

        district: respondent.district ?? '',
      },

      complaint: {
        ...emptyDraft.complaint,

        description:
          parsed?.complaint?.description ?? '',

        category:
          parsed?.complaint?.category ?? '',

        severity:
          parsed?.complaint?.severity ?? '',
      },

      caseType:
        parsed?.caseType ?? '',

      districtOfRespondent:
        parsed?.districtOfRespondent ?? '',

      relation:
        parsed?.relation ?? '',

      uploadScannedComplaint:
        parsed?.uploadScannedComplaint ?? 'No',

      petitionDetails:
        parsed?.petitionDetails ?? {},

      confirmations:
        parsed?.confirmations ?? {},

      declaration:
        parsed?.declaration ?? false,
    };
  } catch (error) {
    console.error(
      'Failed to parse complaint draft:',
      error,
    );

    return emptyDraft;
  }
};

const PETITION_QUESTIONS = [
  'Petitioner name, address, phone number, age, taluk and police station.',

  'Names, addresses and phone numbers of the respondents.',

  'Relationship between the petitioner and the respondent.',

  'What is the nature of the issue? Select the applicable type(s): Physical, Mental, Financial, Sexual, or Property related. If property related, provide a brief description.',

  'Have you complained to the police? If yes, what action was taken? Have you complained to the Panchayat, Municipality, Corporation, District authorities or any other authority? If yes, provide details.',

  'If there has been a death related to the matter, provide the relevant details and whether a police complaint was filed and what action was taken.',

  'Have you approached any court for relief? If yes, provide the name of the court and the nature of the case.',

  'Have you applied for relief under the law relating to protection from domestic violence.',

  'Do you require counselling?',

  'Do you require maintenance/alimony from the respondent? If yes, state the amount required per month.',

  'Have you been removed from your home? Do you need to return to and reside in that home?',

  'Are you employed in any office or organisation? If yes, provide the organisation details.',

  'If gold, money or other items were given as dowry, state the details and whether they need to be returned.',

  'If you have faced physical abuse from the respondent, provide the medical/treatment details and whether compensation is required. If yes, state the amount requested.',

  'Provide any other relevant family or case details that should be considered with this complaint.',
];

const CONFIRMATION_QUESTIONS = [
  'Is the information provided above true to the best of your knowledge?',

  'Have you attached all the relevant documents (if any)?',

  "Is this complaint related to an issue within the Women Commission's jurisdiction?",

  'Have you faced this issue within the last 3 years?',

  'Have you approached any other authority/organization regarding this issue?',

  'Is there any immediate threat to your safety or well-being?',

  'Do you agree to be contacted for further communication regarding this complaint?',

  'Do you want to remain anonymous for this complaint?',

  'Have you read and understood the terms and conditions?',

  'Do you confirm that you will not misuse this complaint system?',
];

const FIELD_OPTIONS = {
  caseType: [
    'Domestic Violence',
    'Harassment',
    'Dowry Related',
    'Property Related',
    'Workplace Related',
    'Other',
  ],

  gender: [
    'Male',
    'Female',
    'Other',
  ],

  marital: [
    'Married',
    'Single',
    'Widow',
    'Divorced',
    'Other',
  ],

  category: [
    'Physical',
    'Mental',
    'Financial',
    'Sexual',
    'Property Related',
    'Domestic Violence',
    'Harassment At Work Place (Pvt)',
    'Police Apathy',
    'Other',
  ],

  severity: [
    'Low',
    'Medium',
    'High',
  ],
};

export default function ComplaintReviewScreen() {
  const params =
    useLocalSearchParams<{
      complaintData?: string;
    }>();

  const initial = useMemo(
    () => parseDraft(params.complaintData),
    [params.complaintData],
  );

  const [draft, setDraft] =
    useState<ComplaintDraft>(initial);

  const [saving, setSaving] =
    useState(false);

  const { width } =
    useWindowDimensions();

  const isDesktop =
    width >= 900;

  const updatePetitioner = (
    key: keyof ComplaintDraft['petitioner'],
    value: string,
  ) => {
    setDraft((d) => ({
      ...d,

      petitioner: {
        ...d.petitioner,
        [key]: value,
      },
    }));
  };

  const updateRespondent = (
    key: keyof Respondent,
    value: string,
  ) => {
    setDraft((d) => ({
      ...d,

      respondent: {
        ...d.respondent,
        [key]: value,
      },
    }));
  };

  const updateComplaint = (
    key: keyof ComplaintDraft['complaint'],
    value: string,
  ) => {
    setDraft((d) => ({
      ...d,

      complaint: {
        ...d.complaint,
        [key]: value,
      },
    }));
  };

  const updatePetition = (
    index: number,
    value: string,
  ) => {
    setDraft((d) => ({
      ...d,

      petitionDetails: {
        ...d.petitionDetails,
        [String(index)]: value,
      },
    }));
  };

  const updateConfirmation = (
    index: number,
    value: string,
  ) => {
    setDraft((d) => ({
      ...d,

      confirmations: {
        ...d.confirmations,
        [String(index)]: value,
      },
    }));
  };

  /**
   * FINAL COMPLAINT SUBMISSION
   *
   * Firebase path:
   *
   * users
   *   └── {currentUser.uid}
   *        └── complaints
   *             └── {autoGeneratedComplaintId}
   */
  const submit = async () => {
    if (
      !draft.petitioner.name.trim() ||
      !draft.petitioner.address.trim() ||
      !draft.petitioner.district.trim()
    ) {
      Alert.alert(
        'Required information',
        'Please complete the petitioner name, address and district.',
      );

      return;
    }

    if (!draft.respondent.name.trim()) {
      Alert.alert(
        'Required information',
        'Please provide the respondent name.',
      );

      return;
    }

    if (!draft.complaint.description.trim()) {
      Alert.alert(
        'Required information',
        'Please provide the complaint description.',
      );

      return;
    }

    const unanswered =
      CONFIRMATION_QUESTIONS.findIndex(
        (_, index) =>
          !draft.confirmations[
            String(index + 1)
          ],
      );

    if (unanswered !== -1) {
      Alert.alert(
        'Confirmation required',
        `Please answer confirmation question ${
          unanswered + 1
        }.`,
      );

      return;
    }

    if (!draft.declaration) {
      Alert.alert(
        'Declaration required',
        'Please confirm the declaration before submitting.',
      );

      return;
    }

    /**
     * Make sure the user is actually authenticated.
     */
    const currentUser =
      auth.currentUser;

    if (!currentUser) {
      Alert.alert(
        'Login required',
        'Your session has expired. Please log in again before submitting the complaint.',
      );

      return;
    }

    setSaving(true);

    try {
      /**
       * Complete Firestore complaint document.
       *
       * We keep the complete editable form inside
       * the "formData" object so no information
       * entered by the citizen is lost.
       */
      const complaintData = {
        status: 'Submitted',

        submittedBy: currentUser.uid,

        petitioner: {
          ...draft.petitioner,
        },

        respondent: {
          ...draft.respondent,
        },

        complaint: {
          ...draft.complaint,
        },

        caseType: draft.caseType,

        districtOfRespondent:
          draft.districtOfRespondent,

        relation: draft.relation,

        uploadScannedComplaint:
          draft.uploadScannedComplaint,

        petitionDetails: {
          ...draft.petitionDetails,
        },

        confirmations: {
          ...draft.confirmations,
        },

        declaration:
          draft.declaration,

        formData: {
          ...draft,
        },

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),

        submittedAt:
          serverTimestamp(),
      };

      /**
       * Create:
       *
       * users/{uid}/complaints/{autoId}
       */
      const complaintRef =
        await addDoc(
          collection(
            db,
            'users',
            currentUser.uid,
            'complaints',
          ),
          complaintData,
        );

      console.log(
        'COMPLAINT SUBMITTED SUCCESSFULLY',
      );

      console.log(
        'Complaint ID:',
        complaintRef.id,
      );

      /**
       * Web
       */
      if (Platform.OS === 'web') {
        window.alert(
          `Complaint submitted successfully.\n\nComplaint ID: ${complaintRef.id}`,
        );

        router.replace(
          '/dashboard',
        );

        return;
      }

      /**
       * Android / native
       */
      Alert.alert(
        'Complaint Submitted Successfully',
        `Your complaint has been submitted successfully.\n\nComplaint ID: ${complaintRef.id}`,
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace(
                '/dashboard',
              );
            },
          },
        ],
      );
    } catch (error) {
      console.error(
        'COMPLAINT SUBMISSION ERROR:',
        error,
      );

      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while submitting your complaint.';

      if (Platform.OS === 'web') {
        window.alert(
          `Complaint submission failed.\n\n${message}`,
        );
      } else {
        Alert.alert(
          'Submission Failed',
          `We could not submit your complaint.\n\n${message}`,
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.page}>
      <ScrollView
        contentContainerStyle={
          styles.scroll
        }
      >
        <View
          style={[
            styles.container,
            isDesktop &&
              styles.desktopContainer,
          ]}
        >
          {/* TOP BAR */}

          <View
            style={styles.topBar}
          >
            <Pressable
              onPress={() =>
                router.back()
              }
              style={
                styles.backButton
              }
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={20}
                color={NAVY}
              />

              <Text
                style={
                  styles.backText
                }
              >
                Back
              </Text>
            </Pressable>

            <View
              style={
                styles.aiBadge
              }
            >
              <MaterialCommunityIcons
                name="auto-fix"
                size={16}
                color={GOLD}
              />

              <Text
                style={
                  styles.aiBadgeText
                }
              >
                AI-assisted draft
              </Text>
            </View>
          </View>

          {/* HERO */}

          <View
            style={styles.hero}
          >
            <View
              style={
                styles.heroIcon
              }
            >
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={28}
                color="#fff"
              />
            </View>

            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={
                  styles.heroTitle
                }
              >
                Review Your Complaint
              </Text>

              <Text
                style={
                  styles.heroText
                }
              >
                We prepared this draft from your complaint. Please check every detail and correct anything before submission.
              </Text>
            </View>
          </View>

          {/* NOTICE */}

          <View
            style={styles.notice}
          >
            <MaterialCommunityIcons
              name="shield-check-outline"
              size={21}
              color={MAROON}
            />

            <Text
              style={
                styles.noticeText
              }
            >
              Your complaint is not submitted yet. You remain in control and can edit the information below.
            </Text>
          </View>

          {/* 1. CASE FILING DETAILS */}

          <Section
            title="1. Case Filing Details"
            icon="clipboard-text-outline"
          >
            <View
              style={styles.grid}
            >
              <Select
                label="Case Type"
                value={
                  draft.caseType
                }
                options={
                  FIELD_OPTIONS.caseType
                }
                onChange={(
                  value,
                ) =>
                  setDraft(
                    (d) => ({
                      ...d,
                      caseType:
                        value,
                    }),
                  )
                }
                required
              />

              <Select
                label="Upload Scanned Complaint"
                value={
                  draft.uploadScannedComplaint
                }
                options={[
                  'Yes',
                  'No',
                ]}
                onChange={(
                  value,
                ) =>
                  setDraft(
                    (d) => ({
                      ...d,
                      uploadScannedComplaint:
                        value,
                    }),
                  )
                }
              />
            </View>
          </Section>

          {/* 2. PETITIONER DETAILS */}

          <Section
            title="2. Petitioner Details"
            icon="account-outline"
          >
            <View
              style={styles.grid}
            >
              <Field
                label="Name"
                value={
                  draft.petitioner
                    .name
                }
                onChangeText={(
                  value,
                ) =>
                  updatePetitioner(
                    'name',
                    value,
                  )
                }
                required
              />

              <Field
                label="Address"
                value={
                  draft.petitioner
                    .address
                }
                onChangeText={(
                  value,
                ) =>
                  updatePetitioner(
                    'address',
                    value,
                  )
                }
                multiline
                required
              />

              <Field
                label="Age"
                value={
                  draft.petitioner
                    .age
                }
                onChangeText={(
                  value,
                ) =>
                  updatePetitioner(
                    'age',
                    value,
                  )
                }
                keyboardType="numeric"
                required
              />

              <Field
                label="District"
                value={
                  draft.petitioner
                    .district
                }
                onChangeText={(
                  value,
                ) =>
                  updatePetitioner(
                    'district',
                    value,
                  )
                }
                required
              />

              <RadioGroup
                label="Gender"
                value={
                  draft.petitioner
                    .gender
                }
                onChange={(
                  value,
                ) =>
                  updatePetitioner(
                    'gender',
                    value,
                  )
                }
                options={
                  FIELD_OPTIONS.gender
                }
              />

              <Field
                label="Phone Number"
                value={
                  draft.petitioner
                    .phone_number
                }
                onChangeText={(
                  value,
                ) =>
                  updatePetitioner(
                    'phone_number',
                    value,
                  )
                }
                keyboardType="phone-pad"
              />

              <Field
                label="Mobile"
                value={
                  draft.petitioner
                    .mobile_number
                }
                onChangeText={(
                  value,
                ) =>
                  updatePetitioner(
                    'mobile_number',
                    value,
                  )
                }
                keyboardType="phone-pad"
                required
              />

              <Field
                label="Email ID"
                value={
                  draft.petitioner
                    .email
                }
                onChangeText={(
                  value,
                ) =>
                  updatePetitioner(
                    'email',
                    value,
                  )
                }
                keyboardType="email-address"
              />

              <RadioGroup
                label="Marital Status"
                value={
                  draft.petitioner
                    .marital_status
                }
                onChange={(
                  value,
                ) =>
                  updatePetitioner(
                    'marital_status',
                    value,
                  )
                }
                options={
                  FIELD_OPTIONS.marital
                }
              />

              <Field
                label="Relation"
                value={
                  draft.relation
                }
                onChangeText={(
                  value,
                ) =>
                  setDraft(
                    (d) => ({
                      ...d,
                      relation:
                        value,
                    }),
                  )
                }
              />

              <Field
                label="District of Respondent"
                value={
                  draft.districtOfRespondent ||
                  draft.respondent
                    .district
                }
                onChangeText={(
                  value,
                ) =>
                  setDraft(
                    (d) => ({
                      ...d,

                      districtOfRespondent:
                        value,

                      respondent: {
                        ...d.respondent,
                        district:
                          value,
                      },
                    }),
                  )
                }
                required
              />
            </View>
          </Section>

          {/* 3. RESPONDENT DETAILS */}

          <Section
            title="3. Respondent Details"
            icon="account-alert-outline"
          >
            <View
              style={styles.grid}
            >
              <Field
                label="Name"
                value={
                  draft.respondent
                    .name
                }
                onChangeText={(
                  value,
                ) =>
                  updateRespondent(
                    'name',
                    value,
                  )
                }
                required
              />

              <Field
                label="Address"
                value={
                  draft.respondent
                    .address
                }
                onChangeText={(
                  value,
                ) =>
                  updateRespondent(
                    'address',
                    value,
                  )
                }
                multiline
              />

              <RadioGroup
                label="Gender"
                value={
                  draft.respondent
                    .gender
                }
                onChange={(
                  value,
                ) =>
                  updateRespondent(
                    'gender',
                    value,
                  )
                }
                options={
                  FIELD_OPTIONS.gender
                }
              />

              <Field
                label="District of Respondent"
                value={
                  draft.respondent
                    .district
                }
                onChangeText={(
                  value,
                ) =>
                  updateRespondent(
                    'district',
                    value,
                  )
                }
                required
              />

              <Field
                label="Mobile"
                value={
                  draft.respondent
                    .mobile_number
                }
                onChangeText={(
                  value,
                ) =>
                  updateRespondent(
                    'mobile_number',
                    value,
                  )
                }
                keyboardType="phone-pad"
              />

              <Field
                label="Relationship"
                value={
                  draft.respondent
                    .relationship
                }
                onChangeText={(
                  value,
                ) =>
                  updateRespondent(
                    'relationship',
                    value,
                  )
                }
              />
            </View>
          </Section>

          {/* 4. CASE DETAILS */}

          <Section
            title="4. Case Details"
            icon="text-box-outline"
          >
            <View
              style={styles.grid}
            >
              <Select
                label="Complaint Category"
                value={
                  draft.complaint
                    .category
                }
                options={
                  FIELD_OPTIONS.category
                }
                onChange={(
                  value,
                ) =>
                  updateComplaint(
                    'category',
                    value,
                  )
                }
                required
              />

              <Select
                label="Severity"
                value={
                  draft.complaint
                    .severity
                }
                options={
                  FIELD_OPTIONS.severity
                }
                onChange={(
                  value,
                ) =>
                  updateComplaint(
                    'severity',
                    value,
                  )
                }
              />
            </View>

            <Field
              label="Case Description"
              value={
                draft.complaint
                  .description
              }
              onChangeText={(
                value,
              ) =>
                updateComplaint(
                  'description',
                  value,
                )
              }
              multiline
              required
              placeholder="Describe the complaint clearly and accurately."
            />

            <Text
              style={
                styles.helper
              }
            >
              Maximum 2500 characters recommended for the complaint description.
            </Text>
          </Section>

          {/* 5. ADDITIONAL PETITION DETAILS */}

          <Section
            title="5. Additional Petition Details"
            icon="format-list-numbered"
          >
            <Text
              style={
                styles.sectionIntro
              }
            >
              These questions are based on the petition questionnaire you provided. Complete the answers that apply to your case.
            </Text>

            {PETITION_QUESTIONS.map(
              (
                question,
                index,
              ) => (
                <View
                  key={index}
                  style={
                    styles.questionCard
                  }
                >
                  <View
                    style={
                      styles.questionNumber
                    }
                  >
                    <Text
                      style={
                        styles.questionNumberText
                      }
                    >
                      {index + 1}
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={
                        styles.questionText
                      }
                    >
                      {question}
                    </Text>

                    <TextInput
                      value={
                        draft
                          .petitionDetails[
                          String(
                            index + 1,
                          )
                        ] ?? ''
                      }
                      onChangeText={(
                        value,
                      ) =>
                        updatePetition(
                          index + 1,
                          value,
                        )
                      }
                      placeholder="Enter your answer"
                      placeholderTextColor="#94A3B8"
                      multiline
                      textAlignVertical="top"
                      style={[
                        styles.input,
                        styles.answerBox,
                      ]}
                    />
                  </View>
                </View>
              ),
            )}
          </Section>

          {/* 6. CONFIRMATION QUESTIONS */}

          <Section
            title="6. Confirmation Questions"
            icon="check-decagram-outline"
          >
            <Text
              style={
                styles.sectionIntro
              }
            >
              Please answer each question before submitting your complaint.
            </Text>

            {CONFIRMATION_QUESTIONS.map(
              (
                question,
                index,
              ) => (
                <View
                  key={index}
                  style={
                    styles.confirmCard
                  }
                >
                  <Text
                    style={
                      styles.confirmNumber
                    }
                  >
                    {index + 1}
                  </Text>

                  <Text
                    style={
                      styles.confirmText
                    }
                  >
                    {question}
                  </Text>

                  <View
                    style={
                      styles.confirmButtons
                    }
                  >
                    {[
                      'Yes',
                      'No',
                    ].map(
                      (option) => {
                        const selected =
                          draft
                            .confirmations[
                            String(
                              index + 1,
                            )
                          ] ===
                          option;

                        return (
                          <Pressable
                            key={
                              option
                            }
                            onPress={() =>
                              updateConfirmation(
                                index +
                                  1,
                                option,
                              )
                            }
                            style={[
                              styles.confirmButton,
                              selected &&
                                styles.confirmButtonSelected,
                            ]}
                          >
                            <View
                              style={[
                                styles.radio,
                                selected &&
                                  styles.radioSelected,
                              ]}
                            >
                              {selected && (
                                <View
                                  style={
                                    styles.radioDot
                                  }
                                />
                              )}
                            </View>

                            <Text
                              style={[
                                styles.confirmButtonText,
                                selected &&
                                  styles.confirmButtonTextSelected,
                              ]}
                            >
                              {option}
                            </Text>
                          </Pressable>
                        );
                      },
                    )}
                  </View>
                </View>
              ),
            )}
          </Section>

          {/* DECLARATION */}

          <Pressable
            onPress={() =>
              setDraft(
                (d) => ({
                  ...d,
                  declaration:
                    !d.declaration,
                }),
              )
            }
            style={
              styles.declaration
            }
          >
            <View
              style={[
                styles.checkbox,
                draft.declaration &&
                  styles.checkboxChecked,
              ]}
            >
              {draft.declaration && (
                <MaterialCommunityIcons
                  name="check"
                  size={16}
                  color="#fff"
                />
              )}
            </View>

            <Text
              style={
                styles.declarationText
              }
            >
              I hereby declare that the information provided above is true and correct.
            </Text>
          </Pressable>

          {/* ACTION BUTTONS */}

          <View
            style={
              styles.actionBar
            }
          >
            <Pressable
              onPress={() =>
                router.back()
              }
              style={
                styles.secondaryButton
              }
            >
              <Text
                style={
                  styles.secondaryButtonText
                }
              >
                Save & Review Later
              </Text>
            </Pressable>

            <Pressable
              onPress={submit}
              disabled={saving}
              style={[
                styles.primaryButton,
                saving && {
                  opacity: 0.6,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="send-check-outline"
                size={20}
                color="#fff"
              />

              <Text
                style={
                  styles.primaryButtonText
                }
              >
                {saving
                  ? 'Submitting...'
                  : 'Review & Submit'}
              </Text>
            </Pressable>
          </View>

          <Text
            style={
              styles.footerNote
            }
          >
            Your information is used to prepare and process your complaint. Review the details carefully before final submission.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  required = false,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
  keyboardType?:
    | 'default'
    | 'numeric'
    | 'email-address'
    | 'phone-pad';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}{' '}
        {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        multiline={multiline}
        keyboardType={keyboardType}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[styles.input, multiline && styles.textArea]}
      />
    </View>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}{' '}
        {required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={styles.selectWrap}>
        {Platform.OS === 'web' ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={
              {
                width: '100%',
                height: 46,
                border: `1px solid ${BORDER}`,
                borderRadius: 10,
                padding: '0 12px',
                fontSize: 14,
                color: INK,
                background: '#fff',
                outline: 'none',
              } as any
            }
          >
            <option value="">Select</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Enter / select"
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />
        )}
      </View>
    </View>
  );
}

function RadioGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.radioRow}>
        {options.map((option) => {
          const selected = value === option;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={styles.radioOption}
            >
              <View style={[styles.radio, selected && styles.radioSelected]}>
                {selected && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioText}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  children: React.ReactNode;
}) {
  return (
    <View
      style={styles.section}
    >
      <View
        style={
          styles.sectionHeader
        }
      >
        <View
          style={
            styles.sectionIcon
          }
        >
          <MaterialCommunityIcons
            name={icon}
            size={18}
            color={MAROON}
          />
        </View>

        <Text
          style={
            styles.sectionTitle
          }
        >
          {title}
        </Text>
      </View>

      <View
        style={
          styles.sectionBody
        }
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: PAGE,
  },

  scroll: {
    paddingBottom: 48,
  },

  container: {
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
    padding: 20,
  },

  desktopContainer: {
    paddingHorizontal: 32,
  },

  topBar: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 8,
  },

  backText: {
    color: NAVY,
    fontSize: 14,
    fontWeight: '700',
  },

  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF9EC',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  aiBadgeText: {
    color: '#765B18',
    fontSize: 12,
    fontWeight: '700',
  },

  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: MAROON,
    borderRadius: 18,
    padding: 22,
  },

  heroIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor:
      'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroTitle: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '800',
  },

  heroText: {
    color: '#FDEDF3',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 5,
    maxWidth: 800,
  },

  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFF8FA',
    borderWidth: 1,
    borderColor: '#F1CBD7',
    borderRadius: 12,
    padding: 13,
    marginTop: 14,
  },

  noticeText: {
    flex: 1,
    color: NAVY,
    fontSize: 13,
    lineHeight: 19,
  },

  section: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
  },

  sectionHeader: {
    minHeight: 54,
    backgroundColor: '#FBF7F8',
    borderBottomWidth: 1,
    borderBottomColor: '#EAD7DE',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 17,
  },

  sectionIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F8E9EE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionTitle: {
    color: INK,
    fontSize: 16,
    fontWeight: '800',
  },

  sectionBody: {
    padding: 18,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 18,
    rowGap: 4,
  },

  field: {
    flexGrow: 1,
    flexBasis: 360,
    marginBottom: 14,
  },

  label: {
    color: INK,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 7,
  },

  required: {
    color: MAROON,
  },

  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    color: INK,
    fontSize: 14,
  },

  textArea: {
    minHeight: 110,
    paddingTop: 12,
  },

  selectWrap: {
    minHeight: 46,
  },

  helper: {
    color: MUTED,
    fontSize: 12,
    marginTop: -4,
  },

  radioRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    minHeight: 46,
    alignItems: 'center',
  },

  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  radio: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioSelected: {
    borderColor: MAROON,
  },

  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: MAROON,
  },

  radioText: {
    color: INK,
    fontSize: 13,
  },

  sectionIntro: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },

  questionCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 13,
    backgroundColor: SOFT,
    borderRadius: 12,
    marginBottom: 10,
  },

  questionNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: MAROON,
    alignItems: 'center',
    justifyContent: 'center',
  },

  questionNumberText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },

  questionText: {
    color: INK,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    marginBottom: 8,
  },

  answerBox: {
    minHeight: 86,
    backgroundColor: '#fff',
  },

  confirmCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 13,
    marginBottom: 10,
  },

  confirmNumber: {
    color: MAROON,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 5,
  },

  confirmText: {
    color: INK,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },

  confirmButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },

  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },

  confirmButtonSelected: {
    borderColor: MAROON,
    backgroundColor: '#FFF5F8',
  },

  confirmButtonText: {
    color: MUTED,
    fontSize: 13,
    fontWeight: '600',
  },

  confirmButtonTextSelected: {
    color: MAROON,
  },

  declaration: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },

  checkbox: {
    width: 21,
    height: 21,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: MAROON,
    borderColor: MAROON,
  },

  declarationText: {
    flex: 1,
    color: INK,
    fontSize: 13,
    lineHeight: 19,
  },

  actionBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
    flexWrap: 'wrap',
  },

  secondaryButton: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: NAVY,
    borderRadius: 11,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: NAVY,
    fontWeight: '800',
    fontSize: 14,
  },

  primaryButton: {
    minHeight: 48,
    backgroundColor: MAROON,
    borderRadius: 11,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },

  footerNote: {
    color: MUTED,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 18,
    paddingHorizontal: 20,
  },
});
