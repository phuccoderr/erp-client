export class FilterUtils {
  static getSortState(
    sort?: string,
    order?: string,
    fieldLabels: Record<string, string> = {}
  ): string | null {
    if (!sort || !order) return null;

    const fieldName = fieldLabels[sort] || sort;
    const direction = order === "desc" ? "giảm dần" : "tăng dần";

    return `sắp xếp theo ${fieldName} thứ tự ${direction}`;
  }

  static getSearchState(value?: string, fieldLabel = "từ khóa"): string | null {
    if (!value?.trim()) return null;
    return `tìm kiếm ${fieldLabel} với "${value.trim()}"`;
  }
}
