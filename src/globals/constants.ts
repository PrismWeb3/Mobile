export class Constants {
  public static readonly USERNAME_MAX_LENGTH = 20;

  public static readonly SECURE_STORAGE_DESO_CONNECTION = "deso-connection";

  public static readonly SECURE_STORAGE_USER = "prism-user-private-key";

  public static readonly SECURE_STORAGE_DEVICE = "prism-device-private-key";

  public static readonly DESO_BASE_URL = "https://bitclout.com/api/v0/";

  public static readonly IPFS_GATEWAY_URL = "https://cloudflare-ipfs.com/ipfs/";

  public static readonly PRISM_BASE_URL = "http://0.0.0.0:7621/";
  // This assumes you're running the backend in Development. Eventually this will be pointed at a testing api

  public static readonly REST_HEADERS = {
    "content-type": "application/json",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.1 Safari/605.1.15",
  };

  public static readonly DEFAULT_PROFILE_PICTURE =
    "QmdXgbfR8pFxE11t1yCdomNWtgz8EaNKr5rqXYeBj1uwcS";
}
