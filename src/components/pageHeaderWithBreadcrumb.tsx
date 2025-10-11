"use client";

import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Segment {
  label: string;
  href?: string;
}

interface PageHeaderWithBreadcrumbProps {
  segments: Segment[];
}

export function PageHeaderWithBreadcrumb({ segments }: PageHeaderWithBreadcrumbProps) {
  return (
    <div className="container mx-auto p-4 md:p-8 flex items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Voltar</span>
      </Button>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {segments.map((segment, index) => (
            <Fragment key={segment.label}>
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
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}