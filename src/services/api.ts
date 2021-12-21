const headers = {
    'content-type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.1 Safari/605.1.15'
};

const host = 'https://bitclout.com/api/v0/';

const handleResponse = (response: Response): Promise<any> => {
    if (response.ok) {
        return response.json().catch(() => { }) as Promise<object>;
    } else {
        throw response;
    }
};

const post = (route: string, body: object) => {
    return fetch(
        host + route,
        {
            headers: headers,
            method: 'POST',
            body: JSON.stringify(body)
        }
    ).then(async p_response => await handleResponse(p_response));
};

function authorizeDerivedKey(
    publicKey: string,
    derivedPublicKey: string,
    accessSignature: string,
    expirationBlock: number,
    deleteKey: boolean
) {
    const route = 'authorize-derived-key';

    return post(
        route,
        {
            OwnerPublicKeyBase58Check: publicKey,
            DerivedPublicKeyBase58Check: derivedPublicKey,
            ExpirationBlock: expirationBlock,
            AccessSignature: accessSignature,
            DeleteKey: deleteKey,
            MinFeeRateNanosPerKB: 10000
        }
    );
}

const appendExtraDataToTransaction = (
    transactionHex: string,
    derivedPublicKey: string
) => {
    const route = 'append-extra-data';

    return post(
        route,
        {
            TransactionHex: transactionHex,
            ExtraData: {
                DerivedPublicKey: derivedPublicKey
            }
        }
    );
};

const submitTransaction = (p_transactionHex: string) => {
    const route = 'submit-transaction';

    return post(
        route,
        {
            TransactionHex: p_transactionHex
        }
    );
};

const getUsersDerivedKeys = (
    publicKey: string
) => {
    const route = 'get-user-derived-keys';

    return post(
        route,
        {
            PublicKeyBase58Check: publicKey
        }
    );
};

export const deSoApi = {
    authorizeDerivedKey,
    appendExtraDataToTransaction,
    submitTransaction,
    getUsersDerivedKeys
};
