
function populateForm(scheduler_div, rule){
	if (!scheduler_div.matches(".rrule-scheduler")) return false;
	
	scheduler_div.querySelector(".all_day").checked = rule.TRANSP === 'TRANSPARENT';
	scheduler_div.querySelector('.end_date').parentElement.style.display = rule.TRANSP === 'TRANSPARENT' ? 'none' : 'initial';
	scheduler_div.querySelector('.start_time').style.display = rule.TRANSP === 'TRANSPARENT' ? 'none' : 'initial';
	
	var start_date = rule.DTSTART.substring(0, 4)+"-"+rule.DTSTART.substring(4, 6)+"-"+rule.DTSTART.substring(6, 8);
	var start_time = rule.DTSTART.substring(9, 11)+":"+rule.DTSTART.substring(11, 13)+":"+rule.DTSTART.substring(13, 15);
	scheduler_div.querySelector(".start_date").value = start_date;
	scheduler_div.querySelector(".start_time").value = start_time;
	
	var end_date = rule.DTEND ? rule.DTEND.substring(0, 4)+"-"+rule.DTEND.substring(4, 6)+"-"+rule.DTEND.substring(6, 8) : '';
	var end_time = rule.DTEND ? rule.DTEND.substring(9, 11)+":"+rule.DTEND.substring(11, 13)+":"+rule.DTEND.substring(13, 15) : '';
	scheduler_div.querySelector(".end_date").value = end_date;
	scheduler_div.querySelector(".end_time").value = end_time;
	
	// default display styles
	scheduler_div.querySelector(".daily_repeat_freq").parentElement.style.display = 'none';
	scheduler_div.querySelector(".weekly_repeat_freq").parentElement.style.display = 'none';
	scheduler_div.querySelector(".monthly_repeat_freq").parentElement.parentElement.style.display = 'none';
	scheduler_div.querySelector(".yearly_repeat_freq").parentElement.style.display = 'none';
	scheduler_div.querySelector(".simple_end_repeat").parentElement.style.display = 'none';
	scheduler_div.querySelector(".frequency_options").style.display = 'none';
	scheduler_div.querySelectorAll(".frequency_day").forEach(c=>c.checked=false);
	scheduler_div.querySelectorAll(".frequency_month_on_dates").item(0).parentElement.parentElement.style.display = 'none';
	scheduler_div.querySelector(".frequency_month_on_the_key").parentElement.style.display = 'none';
	scheduler_div.querySelectorAll(".frequency_year_in_month").forEach(c=>c.checked=false);
	scheduler_div.querySelector(".simple_end_repeat_after").parentElement.style.display = 'none';
	scheduler_div.querySelector(".simple_end_repeat_ondate").parentElement.style.display = 'none';
	
	if(rule.RRULE){
		var rrules = {};
		rule.RRULE.split(';').forEach(r=>{
			var [k, v] = r.split("=");
			rrules[k] = v;
		});
		console.log(rrules);
		if(rrules.INTERVAL){
			scheduler_div.querySelector(".repeat_type").value = "custom";
			scheduler_div.querySelector(".frequency_options").style.display = 'block';
			scheduler_div.querySelector(".frequency").value = rrules.FREQ.toLowerCase();
			switch (rrules.FREQ.toLowerCase()) {
				case "daily":
					scheduler_div.querySelector(".daily_repeat_freq").parentElement.style.display = 'block';
					scheduler_div.querySelector(".daily_repeat_freq").value = rrules.INTERVAL;
					break;
				case "weekly":
					scheduler_div.querySelector(".weekly_repeat_freq").parentElement.style.display = 'block';
					scheduler_div.querySelector(".weekly_repeat_freq").value = rrules.INTERVAL;
					rrules.BYDAY.split(",").map(d=>scheduler_div.querySelectorAll(".frequency_day[value='"+d+"']").checked = true);
					break;
				case "monthly":
					scheduler_div.querySelector(".monthly_repeat_freq").parentElement.parentElement.style.display = 'block';
					scheduler_div.querySelector(".monthly_repeat_freq").value = rrules.INTERVAL;
					if(rrules.BYMONTHDAY){
						scheduler_div.querySelector(".frequency_month_type").value = 'ondates';
						scheduler_div.querySelector(".frequency_month_on_dates").item(0).parentElement.parentElement.style.display = 'block';
					}else{
						scheduler_div.querySelector(".frequency_month_type").value = 'onthe';
						scheduler_div.querySelector(".frequency_month_on_the_key").parentElement.style.display = 'block';
						if(rrules.BYSETPOS){
							scheduler_div.querySelector(".frequency_month_on_the_key").value = rrules.BYSETPOS;
							switch(rrules.BYDAY){
								case "SU,MO,TU,WE,TH,FR,SA":
									scheduler_div.querySelector(".frequency_month_on_the_value").value = 'day';
									break;
								case "MO,TU,WE,TH,FR":
									scheduler_div.querySelector(".frequency_month_on_the_value").value = 'week_day';
									break;
								case "SU,SA":
									scheduler_div.querySelector(".frequency_month_on_the_value").value = 'weekend_day';
									break;
							}
						}else{
							scheduler_div.querySelector(".frequency_month_on_the_key").value = rrules.BYDAY.indexOf("-1") === 0 ? "-1" : rrules.BYDAY.substring(0, 1);
							scheduler_div.querySelector(".frequency_month_on_the_value").value = rrules.BYDAY.indexOf("-1") === 0 ? rrules.BYDAY.substring(2, 2) : rrules.BYDAY.substring(1, 2);
						}
					}
					break;
				case "yearly":
					scheduler_div.querySelector(".yearly_repeat_freq").parentElement.style.display = 'block';
					scheduler_div.querySelector(".yearly_repeat_freq").value = rrules.INTERVAL;
					rrules.BYMONTH.split(",").map(m=>scheduler_div.querySelector(".frequency_year_in_month[value='"+m+"']").checked = true);
					if(rrules.BYSETPOS){
						scheduler_div.querySelector(".frequency_year_on_the_key").value = rrules.BYSETPOS;
						switch(rrules.BYDAY){
							case "SU,MO,TU,WE,TH,FR,SA":
								scheduler_div.querySelector(".frequency_year_on_the_value").value = 'day';
								break;
							case "MO,TU,WE,TH,FR":
								scheduler_div.querySelector(".frequency_year_on_the_value").value = 'week_day';
								break;
							case "SU,SA":
								scheduler_div.querySelector(".frequency_year_on_the_value").value = 'weekend_day';
								break;
						}
					}else{
						scheduler_div.querySelector(".frequency_year_on_the_key").value = rrules.BYDAY.indexOf("-1") === 0 ? "-1" : rrules.BYDAY.substring(0, 1);
						scheduler_div.querySelector(".frequency_year_on_the_value").value = rrules.BYDAY.indexOf("-1") === 0 ? rrules.BYDAY.substring(2, 2) : rrules.BYDAY.substring(1, 2);
					}
					break;
			}
	
		}else{
			var keys = {
				DAILY: 'day',
				WEEKLY: 'week',
				MONTHLY: 'month',
				YEARLY: 'year'
			};
			scheduler_div.querySelector(".repeat_type").value = keys[rrules.FREQ];
			scheduler_div.querySelector(".simple_end_repeat").parentElement.style.display = 'block';
		}
		if(rrules.COUNT){
			scheduler_div.querySelector(".simple_end_repeat").value = 'after';
			scheduler_div.querySelector(".simple_end_repeat_after").parentElement.style.display = 'block';
			scheduler_div.querySelector(".simple_end_repeat_after").value = rrules.COUNT;
		}else if(rrules.UNTIL){
			scheduler_div.querySelector(".simple_end_repeat").value = 'ondate';
			scheduler_div.querySelector(".simple_end_repeat_ondate").parentElement.style.display = 'block';
			scheduler_div.querySelector(".simple_end_repeat_ondate").value = rrules.UNTIL.substring(0, 4)+"-"+rrules.UNTIL.substring(4, 6)+"-"+rrules.UNTIL.substring(6, 8);
		}else{
			scheduler_div.querySelector(".simple_end_repeat").value = 'never';
		}
	}else{
		scheduler_div.querySelector(".repeat_type").value = "none";
	}
}

function generateRRule(input){
	var event = {
		TRANSP: 'OPAQUE', 
		DTSTART: '',
		DTEND: '',
		RRULE: ''
	};
	
	if(input.all_day) event.TRANSP = 'TRANSPARENT';
	
	if(input.start_date){
		var dtstart = input.start_date.split("-").join('');
		if(!input.all_day){ 
			if(input.start_time){
				dtstart += "T" + input.start_time.split(":").join('')+"00Z";
			}else{
				dtstart += "T000000Z";
			}
			if(input.end_date){
				if(input.end_time){
					event.DTEND = input.end_date.split("-").join('') + 'T' + input.end_time.split(":").join('')+"00Z";
				}else{
					event.DTEND = input.end_date.split("-").join('')+"T000000Z";
				}
			}
		}else{
			dtstart += "T000000Z";
		}
		event.DTSTART = dtstart;
	}
		
	
	var rrule = [];
	switch(input.repeat_type){
		case "none": 
			break;
		case "day":
		case "week":
		case "month":
		case "year":
			var keys = {
				day: 'DAILY',
				week: 'WEEKLY',
				month: 'MONTHLY',
				year: 'YEARLY'
			};
			rrule.push('FREQ='+keys[input.repeat_type]);
			break;
		case "custom":
			rrule.push('FREQ='+input.frequency.toUpperCase());
			switch(input.frequency){
				case "daily":
					rrule.push('INTERVAL='+input.daily_repeat_freq);
					break;
				case "weekly":
					rrule.push('INTERVAL='+input.weekly_repeat_freq);
					if(input.frequency_day.length){
						rrule.push('BYDAY='+input.frequency_day.join(','));
					}
					break;
				case "monthly":
					rrule.push('INTERVAL='+input.monthly_repeat_freq);
					if(input.frequency_month_type === 'ondates'){
						rrule.push('BYMONTHDAY='+input.frequency_month_on_dates.join(','));
					}else{
						let f = input.frequency_month_on_the_key;
						switch(input.frequency_month_on_the_value){
							case "SU":
							case "MO":
							case "TU":
							case "WE":
							case "TH":
							case "FR":
							case "SA":
								rrule.push('BYDAY='+f+input.frequency_month_on_the_value);
								break;
							case "day":
								rrule.push('BYSETPOS='+f+';BYDAY=SU,MO,TU,WE,TH,FR,SA');
								break;
							case "week_day":
								rrule.push('BYSETPOS='+f+';BYDAY=MO,TU,WE,TH,FR');
								break;
							case "weekend_day":
								rrule.push('BYSETPOS='+f+';BYDAY=SU,SA');
								break;
						}
					}
					break;
				case "yearly":
					rrule.push('INTERVAL='+input.yearly_repeat_freq);
					rrule.push('BYMONTH='+input.frequency_year_in_month)
					switch(input.frequency_year_on_the_value){
						case "SU":
						case "MO":
						case "TU":
						case "WE":
						case "TH":
						case "FR":
						case "SA":
							rrule.push('BYDAY='+input.frequency_year_on_the_key+input.frequency_year_on_the_value);
							break;
						case "day":
							rrule.push('BYSETPOS='+input.frequency_year_on_the_key+';BYDAY=SU,MO,TU,WE,TH,FR,SA');
							break;
						case "week_day":
							rrule.push('BYSETPOS='+input.frequency_year_on_the_key+';BYDAY=MO,TU,WE,TH,FR');
							break;
						case "weekend_day":
							rrule.push('BYSETPOS='+input.frequency_year_on_the_key+';BYDAY=SU,SA');
							break;
					}
					break;
			}
			break;
	}
	switch(input.simple_end_repeat){
		case "never": 
			break;
		case "after":
			rrule.push('COUNT='+input.simple_end_repeat_after);
			break;
		case "ondate":
			rrule.push('UNTIL='+input.simple_end_repeat_ondate.split("-").join('')+"T000000Z");
			break;
	}
	event.RRULE = rrule.join(';');
	return event;
}

function getFormValues(scheduler_div){
	if (!scheduler_div.matches(".rrule-scheduler")) return false;
	var all_day = scheduler_div.querySelector(".all_day").checked;
	var start_date = scheduler_div.querySelector(".start_date").value;
	var start_time = scheduler_div.querySelector(".start_time").value;
	var end_date = scheduler_div.querySelector(".end_date").value;
	var end_time = scheduler_div.querySelector(".end_time").value;
	var repeat_type = scheduler_div.querySelector(".repeat_type").options[scheduler_div.querySelector(".repeat_type").selectedIndex].value;
	var simple_end_repeat = scheduler_div.querySelector(".simple_end_repeat").options[scheduler_div.querySelector(".simple_end_repeat").selectedIndex].value;
	var simple_end_repeat_after = scheduler_div.querySelector(".simple_end_repeat_after").value;
	var simple_end_repeat_ondate = scheduler_div.querySelector(".simple_end_repeat_ondate").value;
	var frequency = scheduler_div.querySelector(".frequency").options[scheduler_div.querySelector(".frequency").selectedIndex].value;
	var daily_repeat_freq = scheduler_div.querySelector(".daily_repeat_freq").value;
	var frequency_day = [...scheduler_div.querySelectorAll(".frequency_day:checked")].map(e=>e.value);
	var monthly_repeat_freq = scheduler_div.querySelector(".monthly_repeat_freq").value;
	var frequency_month_type = scheduler_div.querySelector(".frequency_month_type").options[scheduler_div.querySelector(".frequency_month_type").selectedIndex].value;
	var frequency_month_on_dates = [...scheduler_div.querySelectorAll(".frequency_month_on_dates:checked")].map(e=>e.value);
	var frequency_month_on_the_key = scheduler_div.querySelector(".frequency_month_on_the_key").options[scheduler_div.querySelector(".frequency_month_on_the_key").selectedIndex].value;
	var frequency_month_on_the_value = scheduler_div.querySelector(".frequency_month_on_the_value").options[scheduler_div.querySelector(".frequency_month_on_the_value").selectedIndex].value;
	var yearly_repeat_freq = scheduler_div.querySelector(".yearly_repeat_freq").value;
	var frequency_year_in_month = [...scheduler_div.querySelectorAll(".frequency_year_in_month:checked")].map(e=>e.value);
	var frequency_year_on_the_key = scheduler_div.querySelector(".frequency_year_on_the_key").options[scheduler_div.querySelector(".frequency_year_on_the_key").selectedIndex].value;
	var frequency_year_on_the_value = scheduler_div.querySelector(".frequency_year_on_the_value").options[scheduler_div.querySelector(".frequency_year_on_the_value").selectedIndex].value;
	return {
		all_day, start_date, start_time, end_date, end_time, repeat_type, 
		simple_end_repeat, simple_end_repeat_after, simple_end_repeat_ondate,
		frequency, daily_repeat_freq, frequency_day, monthly_repeat_freq,
		frequency_month_type, frequency_month_on_dates, frequency_month_on_the_key,
		frequency_month_on_the_value, yearly_repeat_freq, frequency_year_in_month,
		frequency_year_on_the_key, frequency_year_on_the_value, frequency_year_on_the_value
	};
}

// handle "all day" checkbox
document.addEventListener('change', function (e) {
	if (!e.target.matches(".rrule-scheduler .all_day")) return;
	var scheduler = e.target.closest('.rrule-scheduler');

	var end_date = scheduler.querySelector('.end_date');
	end_date.parentElement.style.display = e.target.checked ? 'none' : 'initial';

	var start_time = scheduler.querySelector('.start_time');
	start_time.style.display = e.target.checked ? 'none' : 'initial';

});

// handle "repeat" select
document.addEventListener('change', function (e) {
	if (!e.target.matches(".rrule-scheduler .repeat_type")) return;

	var scheduler = e.target.closest('.rrule-scheduler');
	var end_repeat = scheduler.querySelector(".simple_end_repeat");
	var frequency_options = scheduler.querySelector(".frequency_options");
	end_repeat.parentElement.style.display = 'none';
	frequency_options.style.display = 'none';

	if(e.target.value !== "none"){
		end_repeat.parentElement.style.display = 'block';
	}
	if(e.target.value === "custom"){
		frequency_options.style.display = 'block';
	}
});

// handle "end repeat" select
document.addEventListener('change', function (e) {
	if (!e.target.matches(".rrule-scheduler .simple_end_repeat")) return;

	var scheduler = e.target.closest('.rrule-scheduler');
	var end_repeat_after = scheduler.querySelector(".simple_end_repeat_after");
	var end_repeat_ondate = scheduler.querySelector(".simple_end_repeat_ondate");
	end_repeat_after.parentElement.style.display = 'none';
	end_repeat_ondate.parentElement.style.display = 'none';

	switch (e.target.value) {
		case "never":
			break;
		case "after":
			end_repeat_after.parentElement.style.display = 'inline';
			break;
		case "ondate":
			end_repeat_ondate.parentElement.style.display = 'inline';
			break;
	}
});

// handle "frequency" select
document.addEventListener('change', function (e) {
	if (!e.target.matches(".rrule-scheduler .frequency")) return;

	var scheduler = e.target.closest('.rrule-scheduler');
	var daily_repeat_freq = scheduler.querySelector(".daily_repeat_freq");
	var weekly_repeat_freq = scheduler.querySelector(".weekly_repeat_freq");
	var monthly_repeat_freq = scheduler.querySelector(".monthly_repeat_freq");
	var yearly_repeat_freq = scheduler.querySelector(".yearly_repeat_freq");
	daily_repeat_freq.parentElement.style.display = 'none';
	weekly_repeat_freq.parentElement.style.display = 'none';
	monthly_repeat_freq.parentElement.parentElement.style.display = 'none';
	yearly_repeat_freq.parentElement.style.display = 'none';

	switch (e.target.value) {
		case "daily":
			daily_repeat_freq.parentElement.style.display = 'block';
			break;
		case "weekly":
			weekly_repeat_freq.parentElement.style.display = 'block';
			break;
		case "monthly":
			monthly_repeat_freq.parentElement.parentElement.style.display = 'block';
			break;
		case "yearly":
			yearly_repeat_freq.parentElement.style.display = 'block';
			break;
	}
});

// handle "frequency_month_type" select
document.addEventListener('change', function (e) {
	if (!e.target.matches(".rrule-scheduler .frequency_month_type")) return;

	var scheduler = e.target.closest('.rrule-scheduler');
	var frequency_month_on_dates = scheduler.querySelectorAll(".frequency_month_on_dates");
	var frequency_month_on_the_key = scheduler.querySelector(".frequency_month_on_the_key");
	frequency_month_on_dates.item(0).parentElement.parentElement.style.display = 'none';
	frequency_month_on_the_key.parentElement.style.display = 'none';

	switch (e.target.value) {
		case "ondates":
			frequency_month_on_dates.item(0).parentElement.parentElement.style.display = 'block';
			break;
		case "onthe":
			frequency_month_on_the_key.parentElement.style.display = 'block';
			break;
	}
});

