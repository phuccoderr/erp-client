interface CookieOptions {
  path?: string;
  domain?: string;
  expires?: Date;
  "max-age"?: number;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

export class CookieStorageUtil {
  static get(name: string) {
    const matches = document?.cookie.match(
      new RegExp(
        "(?:^|; )" +
          name.replace(/([\\.$?*|{}\\(\\)\\[\]\\\\/\\+^])/g, "\\$1") +
          "=([^;]*)"
      )
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  static set(name: string, value: string, options: CookieOptions = {}) {
    const defaultOptions: CookieOptions = {
      path: "/",
      ...options,
    };

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
      value
    )}`;

    for (const [key, val] of Object.entries(defaultOptions)) {
      if (key === "expires" && val instanceof Date) {
        cookieString += `; ${key}=${val.toUTCString()}`;
      } else if (val === true) {
        cookieString += `; ${key}`;
      } else if (val !== false && val !== undefined && val !== null) {
        cookieString += `; ${key}=${val}`;
      }
    }

    document.cookie = cookieString;
  }

  static delete(name: string, options: Omit<CookieOptions, "max-age"> = {}) {
    this.set(name, "", {
      ...options,
      "max-age": -1,
    });
  }
}
