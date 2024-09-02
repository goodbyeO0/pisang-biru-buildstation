/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/tutor_management_program.json`.
 */
export type TutorManagementProgram = {
  "address": "2s8DtDbjd6NqMQMUfDwvcMCGGwonTVbK4jDnYSiLomKo",
  "metadata": {
    "name": "tutorManagementProgram",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addTutorInfo",
      "discriminator": [
        68,
        210,
        98,
        54,
        86,
        7,
        37,
        71
      ],
      "accounts": [
        {
          "name": "tutorInfo",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "tutorId"
              },
              {
                "kind": "account",
                "path": "admin"
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "tutorId",
          "type": "string"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "subjectSpecialization",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "hourlyRate",
          "type": "u64"
        },
        {
          "name": "experienceYears",
          "type": "u8"
        },
        {
          "name": "rating",
          "type": "u8"
        },
        {
          "name": "phoneNumber",
          "type": "string"
        },
        {
          "name": "email",
          "type": "string"
        },
        {
          "name": "profileLink",
          "type": "string"
        }
      ]
    },
    {
      "name": "deleteTutorInfo",
      "discriminator": [
        205,
        100,
        25,
        89,
        119,
        20,
        38,
        38
      ],
      "accounts": [
        {
          "name": "tutorInfo",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "tutorId"
              },
              {
                "kind": "account",
                "path": "admin"
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "tutorId",
          "type": "string"
        }
      ]
    },
    {
      "name": "updateTutorInfo",
      "discriminator": [
        34,
        108,
        185,
        3,
        190,
        252,
        177,
        43
      ],
      "accounts": [
        {
          "name": "tutorInfo",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "tutorId"
              },
              {
                "kind": "account",
                "path": "admin"
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "tutorId",
          "type": "string"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "subjectSpecialization",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "hourlyRate",
          "type": "u64"
        },
        {
          "name": "experienceYears",
          "type": "u8"
        },
        {
          "name": "rating",
          "type": "u8"
        },
        {
          "name": "phoneNumber",
          "type": "string"
        },
        {
          "name": "email",
          "type": "string"
        },
        {
          "name": "profileLink",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "tutorInfo",
      "discriminator": [
        184,
        73,
        247,
        119,
        143,
        113,
        254,
        106
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidRating",
      "msg": "Rating must be between 1 and 10"
    },
    {
      "code": 6001,
      "name": "tutorIdTooLong",
      "msg": "Tutor ID too long"
    },
    {
      "code": 6002,
      "name": "nameTooLong",
      "msg": "Name too long"
    },
    {
      "code": 6003,
      "name": "phoneNumberTooLong",
      "msg": "Phone number too long"
    },
    {
      "code": 6004,
      "name": "emailTooLong",
      "msg": "Email too long"
    },
    {
      "code": 6005,
      "name": "profileLinkTooLong",
      "msg": "Profile link too long"
    }
  ],
  "types": [
    {
      "name": "tutorInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "type": "pubkey"
          },
          {
            "name": "tutorId",
            "type": "string"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "subjectSpecialization",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "hourlyRate",
            "type": "u64"
          },
          {
            "name": "experienceYears",
            "type": "u8"
          },
          {
            "name": "rating",
            "type": "u8"
          },
          {
            "name": "verified",
            "type": "bool"
          },
          {
            "name": "phoneNumber",
            "type": "string"
          },
          {
            "name": "email",
            "type": "string"
          },
          {
            "name": "profileLink",
            "type": "string"
          }
        ]
      }
    }
  ]
};
