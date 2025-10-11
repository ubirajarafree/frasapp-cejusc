import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import React from "react";
import { BbotaoVoltar } from "./botaoVoltar";

interface Segment {
  label: string;
  href?: string;
}

interface PageHeaderWithBreadcrumbProps {
  segments: Segment[];
}

export function PageHeaderWithBreadcrumb({ segments }: PageHeaderWithBreadcrumbProps) {
  return (
    <div className="container flex items-center gap-4 p-4 md:p-8">
      <BbotaoVoltar />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {segments.map((segment, index) => (
            <React.Fragment key={segment.label}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === segments.length - 1 ? (
                  <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={segment.href!}>{segment.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}