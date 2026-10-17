import React from "react";
import { Link } from "react-router-dom";
import { CompassIcon } from "lucide-react";
import { buttonClasses } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";

export function NotFoundPage() {
  return (
    <div className="py-12">
      <EmptyState
        icon={CompassIcon}
        title="This page has checked out"
        description="We couldn't find the page you were looking for. It may have moved, or the link may be mistyped."
        action={
        <>
            <Link to="/" className={buttonClasses("primary")}>
              Return home
            </Link>
            <Link to="/hotels" className={buttonClasses("outline")}>
              Browse hotels
            </Link>
          </>
        } />
      
    </div>);

}