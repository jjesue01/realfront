import React from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import cn from "classnames";
import styles from './NavLink.module.sass'

function NavLink({ href, exact, children, ...props }) {
  const { pathname } = useRouter();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link href={href}>
      <a className={cn(styles.link, { [styles.active]: isActive })} {...props}>
        {children}
      </a>
    </Link>
  );
}

export default NavLink