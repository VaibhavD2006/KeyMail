# KeyMail Database Schema

## Users Collection
```json
{
  "id": "UUID",
  "email": "String",
  "name": "String",
  "companyName": "String",
  "plan": "String (free/premium/enterprise)",
  "createdAt": "Date",
  "settings": {
    "timezone": "String",
    "emailSignature": "String",
    "defaultEmailTemplate": "String"
  },
  "emailIntegration": {
    "provider": "String (gmail/outlook/mailchimp)",
    "accessToken": "String",
    "refreshToken": "String",
    "expiresAt": "Date"
  }
}
```

## Clients Collection
```json
{
  "id": "UUID",
  "userId": "UUID",
  "name": "String",
  "email": "String",
  "phone": "String",
  "birthday": "Date",
  "closingAnniversary": "Date",
  "yearsKnown": "Integer",
  "relationshipLevel": "String",
  "tags": ["String"],
  "customFields": {
    "field1": "Value1",
    "field2": "Value2"
  },
  "preferences": {
    "communicationFrequency": "String",
    "preferredContactMethod": "String"
  },
  "lastContactDate": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Emails Collection
```json
{
  "id": "UUID",
  "userId": "UUID",
  "clientId": "UUID",
  "occasion": "String",
  "subject": "String",
  "generatedContent": "Text",
  "editedContent": "Text",
  "status": "String (draft/pending/approved/sent/failed)",
  "scheduledDate": "Date",
  "sentDate": "Date",
  "metadata": {
    "templateId": "String",
    "aiParameters": {
      "tone": "String",
      "style": "String",
      "length": "String"
    }
  },
  "analytics": {
    "opened": "Boolean",
    "openedAt": "Date",
    "clicked": "Boolean",
    "clickedAt": "Date"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Templates Collection
```json
{
  "id": "UUID",
  "userId": "UUID",
  "name": "String",
  "category": "String",
  "content": "Text",
  "variables": ["String"],
  "isDefault": "Boolean",
  "metadata": {
    "tone": "String",
    "occasion": "String",
    "suggestedUse": "String"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Analytics Collection
```json
{
  "id": "UUID",
  "userId": "UUID",
  "period": "String (daily/weekly/monthly)",
  "date": "Date",
  "metrics": {
    "emailsSent": "Integer",
    "emailsOpened": "Integer",
    "clickThroughRate": "Float",
    "clientEngagement": "Float"
  },
  "createdAt": "Date"
}
``` 