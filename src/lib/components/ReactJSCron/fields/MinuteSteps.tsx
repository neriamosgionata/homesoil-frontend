import React, { useMemo } from "react";

import CustomSelect from "../components/CustomSelect";
import { UNIT_STEPS, UNITS } from "../constants";
import { DEFAULT_LOCALE_EN } from "../locale";
import type { MinutesStepsProps } from "../types";
import { classNames } from "../utils";

export default function MinuteSlot(props: MinutesStepsProps) {
	const {
		value,
		setValue,
		locale,
		className,
		disabled,
		readOnly,
		leadingZero,
		clockFormat,
		period,
		periodicityOnDoubleClick,
		mode,
		allowClear,
		filterOption
	} = props;
	const internalClassName = useMemo(
		() =>
			classNames({
				"react-js-cron-field": true,
				"react-js-cron-hours": true,
				[`${className}-field`]: !!className,
				[`${className}-hours`]: !!className
			}),
		[className]
	);

	return (
		<div className={internalClassName}>
			{locale.prefixMinutesSteps !== "" && (
				<span>{locale.prefixMinutesSteps || DEFAULT_LOCALE_EN.prefixMinutesSteps}</span>
			)}

			<CustomSelect
				placeholder={
					period === "hour"
						? locale.emptyMinutesForHourPeriod || DEFAULT_LOCALE_EN.emptyMinutesForHourPeriod
						: locale.emptyMinutes || DEFAULT_LOCALE_EN.emptyMinutes
				}
				value={value}
				unit={UNIT_STEPS}
				setValue={setValue}
				locale={locale}
				className={className}
				disabled={disabled}
				readOnly={readOnly}
				leadingZero={leadingZero}
				clockFormat={clockFormat}
				period={period}
				periodicityOnDoubleClick={periodicityOnDoubleClick}
				mode={mode}
				allowClear={allowClear}
				filterOption={filterOption}
			/>
		</div>
	);
}
