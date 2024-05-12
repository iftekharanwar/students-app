import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Keyboard, View, ViewProps } from 'react-native';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { useReplyToTicket } from '../../../core/queries/ticketHooks';
import { Attachment } from '../../services/types/Attachment';
import { MessagingView } from './MessagingView';

interface Props {
  disabled?: boolean;
  ticketId: number;
  onLayout?: ViewProps['onLayout'];
}

export const TicketMessagingView = ({
  disabled,
  ticketId,
  onLayout,
}: Props) => {
  const { t } = useTranslation();
  const bottomBarHeight = useBottomTabBarHeight();
  const [message, setMessage] = useState<string>('');
  const [attachment, setAttachment] = useState<Attachment>();
  const [isSending, setIsSending] = useState<boolean>(false);

  const {
    mutateAsync: reply,
    isLoading,
    isSuccess,
  } = useReplyToTicket(ticketId);

  const onSend = () => {
    if (isSending) {
      // Prevent multiple sends if already in the process of sending a message
      return;
    }
    setIsSending(true);
    reply({
      ticketId: ticketId,
      attachment: attachment as unknown as Blob,
      message: message.trim().replace(/\n/g, '<br>'),
    })
      .then(() => {
        setIsSending(false);
      })
      .catch(() => {
        setIsSending(false);
        Alert.alert(t('common.error'), t('ticketScreen.sendError'));
      });
  };

  useEffect(() => {
    if (isSuccess) {
      setMessage('');
      setAttachment(undefined);
      Keyboard.dismiss();
    }
  }, [isSuccess]);

  useEffect(() => {
    // Reset isSending when the loading state changes
    setIsSending(isLoading);
  }, [isLoading]);

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
      }}
    >
      <KeyboardAccessoryView
        androidAdjustResize
        avoidKeyboard
        alwaysVisible
        hideBorder
        heightProperty="minHeight"
        // eslint-disable-next-line react-native/no-color-literals
        style={{
          backgroundColor: 'transparent',
        }}
      >
        {({ isKeyboardVisible }) => (
          <MessagingView
            message={message}
            onMessageChange={setMessage}
            attachment={attachment}
            onAttachmentChange={setAttachment}
            loading={isLoading || isSending}
            disabled={disabled || isSending}
            onLayout={onLayout}
            onSend={onSend}
            style={
              !isKeyboardVisible && {
                marginBottom: bottomBarHeight,
              }
            }
          />
        )}
      </KeyboardAccessoryView>
    </View>
  );
};
