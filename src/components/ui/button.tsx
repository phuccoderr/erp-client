import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@lib";

const buttonVariants = cva(
  "cursor-pointer " + // Con trỏ chuột thành hình bàn tay khi hover (cho biết có thể click)
    "inline-flex items-center justify-center " + // Sử dụng flex để căn giữa nội dung theo cả chiều ngang và dọc
    "gap-2 " + // Khoảng cách 0.5rem (8px) giữa các phần tử con (text và icon)
    "whitespace-nowrap " + // Ngăn text xuống dòng, giữ button trên một hàng
    "rounded-md " + // Bo góc trung bình (medium border radius)
    "text-xs font-medium " + // Kích thước chữ nhỏ (14px) và độ đậm medium
    "transition-all " + // Hiệu ứng mượt mà cho mọi thay đổi (hover, focus,...)
    "disabled:pointer-events-none " + // Khi disabled: không nhận sự kiện click chuột
    "disabled:opacity-50 " + // Khi disabled: làm mờ 50%
    "[&_svg]:pointer-events-none " + // Các icon SVG bên trong không nhận sự kiện chuột (tránh conflict)
    "[&_svg:not([class*='size-'])]:size-4 " + // Nếu icon SVG không có class chứa "size-" (ví dụ size-5), thì tự động set kích thước 4 (16px)
    "shrink-0 [&_svg]:shrink-0 " + // Button và icon không bị co lại khi flex shrink
    "outline-none " + // Loại bỏ viền outline mặc định khi focus (sẽ thay bằng focus-visible custom)
    "aria-invalid:ring-destructive/20 " + // Nếu có aria-invalid (lỗi form): thêm ring màu destructive (đỏ) trong suốt 20% ở light mode
    "dark:aria-invalid:ring-destructive/40 " + // Ở dark mode: ring destructive trong suốt 40% (đậm hơn một chút)
    "aria-invalid:border-destructive", // Nếu lỗi: viền button chuyển thành màu destructive (đỏ),
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        outline_primary:
          "bg-outline border border-outline-foreground text-outline-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-sm gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-sm px-6 has-[>svg]:px-4",
        xs: "h-6 rounded-sm text-xs font-medium gap-1 px-2.5 has-[>svg]:px-2",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
        "icon-xs": "size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "sm",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
export type CopyButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };
export { Button, buttonVariants };
