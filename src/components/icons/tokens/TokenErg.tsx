import * as React from 'react';

function SvgTokenErg(props: React.SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      width={24}
      height={24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx={12} cy={12} r={12} fill="#DBDBDB" />
      <path
        d="M20.698 11.738l-2.362-5.703a.685.685 0 00-.371-.37l-5.703-2.363a.686.686 0 00-.524 0L6.035 5.664a.685.685 0 00-.37.371l-2.363 5.703a.684.684 0 000 .524l2.362 5.703c.07.168.203.301.371.37l5.703 2.363a.687.687 0 00.524 0l5.703-2.362a.685.685 0 00.37-.371l2.363-5.703a.686.686 0 000-.524zm-5.866-1.986h-3.316l2.056 2.153-2.128 2.342h3.387v1.574H9.17v-1.43l2.228-2.467-2.218-2.31V8.178h5.652l.001 1.573z"
        fill="#141414"
      />
    </svg>
  );
}

export default SvgTokenErg;
