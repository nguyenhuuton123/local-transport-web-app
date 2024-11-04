"use client";
// import MainHeader from "@/components/common/header/MainHeader";
// import MainFooter from "@/components/common/footer/MainFooter";
// import MobiNav from "@/components/common/mobile-nav/MobiNav";
// import { getFirstURISegment } from "@/utility/uriSegment.utility";
// import LoginForm from "@/app/dang-nhap/page";

export default function ClientLayout({ children }) {
  // const url = getFirstURISegment();
  // const isFormPage = url && url.startsWith("dang-nhap");

  return (
    <>
      {/* {isFormPage ? (
        <LoginForm />
      ) : ( */}
        <>
          {/* MainHeader start */}
          {/* <MainHeader /> */}
          {/* MainHeader end */}

          {children}

          {/* MainFooter start */}
          {/* <MainFooter /> */}
          {/* MainFooter end */}

          {/* MobiNav start */}
          {/* <MobiNav /> */}
          {/* MobiNav end */}
        </>
      {/* )} */}
    </>
  );
}
