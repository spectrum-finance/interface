interface Window {
  ergo_request_read_access: () => Promise<boolean>;
  ergo_check_read_access: () => Promise<boolean>;
  needUpdate: boolean;
}
