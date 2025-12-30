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

  static set(
    name: string,
    value: string,
    options: { [key: string]: any } = {}
  ) {
    options = {
      path: "/",
      // add other defaults here if necessary
      ...options,
    };

    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }

    let updatedCookie =
      encodeURIComponent(name) + "=" + encodeURIComponent(value);
    for (const optionKey of Object.keys(options)) {
      updatedCookie += "; " + optionKey;
      const optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
      }
    }

    document.cookie = updatedCookie;
  }

  static delete(name: string) {
    this.set(name, "", {
      "max-age": -1,
    });
  }
}
