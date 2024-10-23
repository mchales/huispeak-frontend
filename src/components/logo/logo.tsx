'use client';

import type { BoxProps } from '@mui/material/Box';

import { useId, forwardRef } from 'react';

import Box from '@mui/material/Box';
import NoSsr from '@mui/material/NoSsr';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = BoxProps & {
  href?: string;
  disableLink?: boolean;
};

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ width = 40, height = 40, disableLink = false, className, href = '/', sx, ...other }, ref) => {
    const theme = useTheme();

    const gradientId = useId();

    const PRIMARY_LIGHT = theme.vars.palette.primary.light;

    const PRIMARY_MAIN = theme.vars.palette.primary.main;

    const PRIMARY_DARK = theme.vars.palette.primary.dark;

    /*
     * OR using local (public folder)
     * const logo = ( <Box alt="logo" component="img" src={`${CONFIG.site.basePath}/logo/logo-single.svg`} width={width} height={height} /> );
     */

    const logo = (
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512">
        <defs>
          <linearGradient id={`${gradientId}-1`} x1="100%" x2="50%" y1="9.946%" y2="50%">
            <stop offset="0%" stopColor={PRIMARY_DARK} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          <linearGradient id={`${gradientId}-2`} x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          <linearGradient id={`${gradientId}-3`} x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>
        </defs>

        <g fill={PRIMARY_MAIN} fillRule="evenodd" stroke="none" strokeWidth="1">
          <path
            fill={`url(#${`${gradientId}-2`})`}
            d="M246.783 10.118 C 217.480 25.197,199.672 51.910,192.703 91.244 L 190.905 101.390 179.332 103.175 C 91.160 116.773,42.052 210.341,80.993 290.547 C 84.013 296.768,86.262 302.080,85.990 302.352 C 85.483 302.859,53.653 298.747,49.727 297.667 L 47.541 297.065 49.727 298.666 C 53.887 301.712,73.850 308.471,92.657 313.200 C 171.301 332.977,263.155 328.781,338.558 301.966 C 347.224 298.884,350.300 296.507,344.123 297.666 C 340.831 298.283,314.431 301.561,312.295 301.618 C 310.749 301.659,311.484 299.380,316.294 289.222 C 353.859 209.898,305.163 117.148,218.699 103.335 C 206.010 101.308,206.672 102.313,210.941 91.561 C 220.669 67.063,240.557 47.500,265.285 38.108 C 273.598 34.950,273.609 36.193,265.128 19.699 C 256.799 3.499,258.213 4.237,246.783 10.118 M217.777 136.749 C 260.597 143.941,293.087 174.834,306.709 221.311 C 310.020 232.608,309.414 262.210,305.613 274.863 C 302.221 286.153,294.742 302.544,292.665 303.241 C 276.486 308.668,133.266 309.446,105.876 304.256 C 103.485 303.803,102.182 301.950,98.035 293.113 C 59.977 212.009,129.026 121.842,217.777 136.749 M359.563 333.999 C 335.252 337.205,294.839 341.307,267.760 343.319 C 247.376 344.833,158.252 345.254,129.073 343.975 C 102.429 342.807,68.275 339.341,38.611 334.796 C 21.354 332.152,21.894 332.983,42.913 341.420 L 47.028 343.072 43.130 349.951 C -24.847 469.911,60.531 616.689,198.361 616.820 C 333.523 616.948,419.424 474.747,356.237 355.473 C 352.570 348.552,349.974 342.540,350.468 342.114 C 350.962 341.688,355.792 339.722,361.202 337.745 C 369.947 334.549,375.083 332.007,372.077 332.363 C 371.505 332.431,365.874 333.167,359.563 333.999 M335.145 357.214 C 395.115 475.960,279.548 608.478,150.820 568.577 C 82.371 547.359,37.186 474.826,47.506 402.732 C 50.939 378.753,62.983 347.626,68.246 349.134 C 140.225 369.767,241.480 370.508,316.393 350.950 C 331.303 347.058,329.755 346.541,335.145 357.214"
          />
        </g>
      </svg>
    );

    return (
      <NoSsr
        fallback={
          <Box
            width={width}
            height={height}
            className={logoClasses.root.concat(className ? ` ${className}` : '')}
            sx={{ flexShrink: 0, display: 'inline-flex', verticalAlign: 'middle', ...sx }}
          />
        }
      >
        <Box
          ref={ref}
          component={RouterLink}
          href={href}
          width={width}
          height={height}
          className={logoClasses.root.concat(className ? ` ${className}` : '')}
          aria-label="logo"
          sx={{
            flexShrink: 0,
            display: 'inline-flex',
            verticalAlign: 'middle',
            ...(disableLink && { pointerEvents: 'none' }),
            ...sx,
          }}
          {...other}
        >
          {logo}
        </Box>
      </NoSsr>
    );
  }
);
