import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Badge,
  Button,
  CloseReason,
  IconButton,
  Snackbar,
  SnackbarCloseReason,
  SnackbarContent,
  SnackbarProps,
} from '@mui/material';
import useSlotProps from '@mui/utils/useSlotProps';
import { useNonNullableContext } from '@toolpad/utils/react';
import * as React from 'react';
import { NotificationsContext } from './NotificationsContext';
import type {
  CloseNotification,
  ShowNotification,
  ShowNotificationOptions,
} from './useNotifications';

const closeText = 'Close';

export interface NotificationsProviderSlotProps {
  snackbar: SnackbarProps;
}

export interface NotificationsProviderSlots {
  /**
   * The component that renders the snackbar.
   * @default Snackbar
   */
  snackbar: React.ElementType;
}

const RootPropsContext = React.createContext<NotificationsProviderProps | null>(null);

interface NotificationProps {
  notificationKey: string;
  badge: string | null;
  open: boolean;
  message: React.ReactNode;
  options: ShowNotificationOptions;
}

function Notification({ notificationKey, open, message, options, badge }: NotificationProps) {
  const { close } = useNonNullableContext(NotificationsContext);

  const { severity, actionText, onAction, autoHideDuration } = options;

  const handleClose = React.useCallback(
    (event: unknown, reason?: CloseReason | SnackbarCloseReason) => {
      if (reason === 'clickaway') {
        return;
      }
      close(notificationKey);
    },
    [notificationKey, close],
  );

  const action = (
    <React.Fragment>
      {onAction ? (
        <Button color="inherit" size="small" onClick={onAction}>
          {actionText ?? 'Action'}
        </Button>
      ) : null}
      <IconButton
        size="small"
        aria-label={closeText}
        title={closeText}
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const props = React.useContext(RootPropsContext);
  const SnackbarComponent = props?.slots?.snackbar ?? Snackbar;
  const snackbarSlotProps = useSlotProps({
    elementType: SnackbarComponent,
    ownerState: props,
    externalSlotProps: props?.slotProps?.snackbar,
    additionalProps: {
      open,
      autoHideDuration,
      onClose: handleClose,
      action,
    },
  });

  return (
    <SnackbarComponent key={notificationKey} {...snackbarSlotProps}>
      <Badge badgeContent={badge} color="primary" sx={{ width: '100%' }}>
        {severity ? (
          <Alert severity={severity} sx={{ width: '100%' }} action={action}>
            {message}
          </Alert>
        ) : (
          <SnackbarContent message={message} action={action} />
        )}
      </Badge>
    </SnackbarComponent>
  );
}

interface NotificationQueueEntry {
  notificationKey: string;
  options: ShowNotificationOptions;
  open: boolean;
  message: React.ReactNode;
}

interface NotificationsState {
  queue: NotificationQueueEntry[];
}

interface NotificationsProps {
  state: NotificationsState;
}

function Notifications({ state }: NotificationsProps) {
  const currentNotification = state.queue[0] ?? null;

  return currentNotification ? (
    <Notification
      {...currentNotification}
      badge={state.queue.length > 1 ? String(state.queue.length) : null}
    />
  ) : null;
}

export interface NotificationsProviderProps {
  children?: React.ReactNode;
  // eslint-disable-next-line react/no-unused-prop-types
  slots?: Partial<NotificationsProviderSlots>;
  // eslint-disable-next-line react/no-unused-prop-types
  slotProps?: Partial<NotificationsProviderSlotProps>;
}

let nextId = 0;
const generateId = () => {
  const id = nextId;
  nextId += 1;
  return id;
};

/**
 * Provider for Notifications. The subtree of this component can use the `useNotifications` hook to
 * access the notifications API. The notifications are shown in the same order they are requested.
 *
 * Demos:
 *
 * - [Sign-in Page](https://mui.com/toolpad/core/react-sign-in-page/)
 * - [useNotifications](https://mui.com/toolpad/core/react-use-notifications/)
 *
 * API:
 *
 * - [NotificationsProvider API](https://mui.com/toolpad/core/api/notifications-provider)
 */
function NotificationsProvider(props: NotificationsProviderProps) {
  const { children } = props;
  const [state, setState] = React.useState<NotificationsState>({ queue: [] });

  const show = React.useCallback<ShowNotification>((message, options = {}) => {
    const notificationKey = options.key ?? `::toolpad-internal::notification::${generateId()}`;
    setState((prev) => {
      // deduplicate by replacement
      return {
        ...prev,
        queue: [
          ...prev.queue.filter((n) => n.notificationKey !== notificationKey),
          { message, options, notificationKey, open: true },
        ],
      };
    });
    return notificationKey;
  }, []);

  const close = React.useCallback<CloseNotification>((key) => {
    setState((prev) => ({
      ...prev,
      queue: prev.queue.filter((n) => n.notificationKey !== key),
    }));
  }, []);

  const contextValue = React.useMemo(() => ({ show, close }), [show, close]);

  return (
    <RootPropsContext.Provider value={props}>
      <NotificationsContext.Provider value={contextValue}>
        {children}
        <Notifications state={state} />
      </NotificationsContext.Provider>
    </RootPropsContext.Provider>
  );
}

export { NotificationsProvider };
