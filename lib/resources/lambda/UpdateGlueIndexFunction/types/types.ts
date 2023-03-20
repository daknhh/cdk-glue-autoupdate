export interface AcceptHandshake {
    eventVersion:                 string;
    userIdentity:                 UserIdentity;
    eventTime:                    Date;
    eventSource:                  string;
    eventName:                    "AcceptHandshake";
    awsRegion:                    string;
    sourceIPAddress:              string;
    userAgent:                    string;
    requestParameters:            RequestParameters;
    responseElements:             ResponseElements;
    requestID:                    string;
    eventID:                      string;
    readOnly:                     boolean;
    eventType:                    string;
    managementEvent:              boolean;
    recipientAccountId:           string;
    sharedEventID:                string;
    eventCategory:                string;
    tlsDetails:                   TLSDetails;
    sessionCredentialFromConsole: string;
}

export interface RequestParameters {
    handshakeId: string;
}

export interface ResponseElements {
    handshake: Handshake;
}

export interface Handshake {
    id:                  string;
    requestedTimestamp:  string;
    action:              string;
    state:               string;
    resources:           HandshakeResource[];
    parties:             Party[];
    arn:                 string;
    expirationTimestamp: string;
}

export interface Party {
    id:   string;
    type: string;
}

export interface HandshakeResource {
    type:       string;
    resources?: ResourceResource[];
    value:      string;
}

export interface ResourceResource {
    type:  string;
    value: string;
}


export interface TLSDetails {
    tlsVersion:               string;
    cipherSuite:              string;
    clientProvidedHostHeader: string;
}

export interface UserIdentity {
    type:        string;
    principalId: string;
    accountId:   string;
}


export interface CreateAccountResult {
    eventVersion:        string;
    userIdentity:        UserIdentity;
    eventTime:           Date;
    eventSource:         string;
    eventName:           "CreateAccountResult";
    awsRegion:           string;
    sourceIPAddress:     string;
    userAgent:           string;
    requestParameters:   null;
    responseElements:    null;
    eventID:             string;
    readOnly:            boolean;
    eventType:           string;
    recipientAccountId:  string;
    serviceEventDetails: ServiceEventDetails;
}

export interface ServiceEventDetails {
    createAccountStatus: CreateAccountStatus;
}

export interface CreateAccountStatus {
    id:                 string;
    state:              string;
    accountName:        string;
    accountId:          string;
    requestedTimestamp: string;
    completedTimestamp: string;
}

export interface UserIdentity {
    accountId: string;
    invokedBy: string;
}

export interface GlueTableEntry {
    TableName: string,
    DatabaseName: string,
    ParameterName: string
}