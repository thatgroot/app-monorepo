// TODO set value type to string
enum ETHMessageTypes {
  ETH_SIGN = 0,
  PERSONAL_SIGN = 1,
  TYPED_DATA_V1 = 2,
  TYPED_DATA_V3 = 3,
  TYPED_DATA_V4 = 4,
}

enum AptosMessageTypes {
  SIGN_MESSAGE = 'aptosSignMessage',
}

export function getEthProviderMethodFromMessageType(
  type: ETHMessageTypes | AptosMessageTypes,
) {
  // https://docs.metamask.io/guide/signing-data.html#a-brief-history
  switch (type) {
    case ETHMessageTypes.ETH_SIGN:
      return 'eth_sign';
    case ETHMessageTypes.PERSONAL_SIGN:
      return 'personal_sign';
    case ETHMessageTypes.TYPED_DATA_V1:
      return 'eth_signTypedData';
    case ETHMessageTypes.TYPED_DATA_V3:
      return 'eth_signTypedData_v3';
    case ETHMessageTypes.TYPED_DATA_V4:
      return 'eth_signTypedData_v4';
    case AptosMessageTypes.SIGN_MESSAGE:
      return 'signMessage';
    default:
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-case-declarations
      const checkType: never = type;
  }
}

type ETHMessage = {
  type: ETHMessageTypes;
  message: string;
};

type AptosMessage = {
  type: AptosMessageTypes;
  message: string;
};

type Message = string | ETHMessage | AptosMessage;

export { ETHMessageTypes, AptosMessageTypes };
export type { ETHMessage, AptosMessage, Message };
