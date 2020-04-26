
class RecurComponent{
	constructor(component_div){
		this.component_div = component_div;
		this.inputs = {
			all_day: this.component_div.querySelector(".all_day"),
			start_date: this.component_div.querySelector(".start_date"),
			start_time: this.component_div.querySelector(".start_time"),
			end_date: this.component_div.querySelector(".end_date"),
			end_time: this.component_div.querySelector(".end_time"),
			repeat_type: this.component_div.querySelector(".repeat_type"),
			simple_end_repeat: this.component_div.querySelector(".simple_end_repeat"),
			simple_end_repeat_after: this.component_div.querySelector(".simple_end_repeat_after"),
			simple_end_repeat_ondate: this.component_div.querySelector(".simple_end_repeat_ondate"),
			frequency: this.component_div.querySelector(".frequency"),
			daily_repeat_freq: this.component_div.querySelector(".daily_repeat_freq"),
			weekly_repeat_freq: this.component_div.querySelector(".weekly_repeat_freq"),
			frequency_day: [...this.component_div.querySelectorAll(".frequency_day")],
			monthly_repeat_freq: this.component_div.querySelector(".monthly_repeat_freq"),
			frequency_month_type: this.component_div.querySelector(".frequency_month_type"),
			frequency_month_on_dates: [...this.component_div.querySelectorAll(".frequency_month_on_dates")],
			frequency_month_on_the_key: this.component_div.querySelector(".frequency_month_on_the_key"),
			frequency_month_on_the_value: this.component_div.querySelector(".frequency_month_on_the_value"),
			yearly_repeat_freq: this.component_div.querySelector(".yearly_repeat_freq"),
			frequency_year_in_month: [...this.component_div.querySelectorAll(".frequency_year_in_month")],
			frequency_year_on_the_key: this.component_div.querySelector(".frequency_year_on_the_key"),
			frequency_year_on_the_value: this.component_div.querySelector(".frequency_year_on_the_value")
		};
		this.subcomponents = {
			// contains end_date, end_time inputs
			end_date: this.component_div.querySelector('.end_date').parentElement,
			// contains start_time input
			start_time: this.component_div.querySelector('.start_time'),
			// contains simple_end_repeat, simple_end_repeat_after, simple_end_repeat_ondate inputs
			end_repeat: this.component_div.querySelector(".simple_end_repeat").parentElement,
			// contains simple_end_repeat_after input
			end_repeat_after: this.component_div.querySelector(".simple_end_repeat_after").parentElement,
			// contains simple_end_repeat_ondate input
			end_repeat_ondate: this.component_div.querySelector(".simple_end_repeat_ondate").parentElement,
			// -----------------------------------------------------------------
			// contains subcomponents related to "custom" inputs (all of the following subcomponents)
			frequency_options: this.component_div.querySelector(".frequency_options"),
			// contains daily_repeat_freq input
			daily_repeat_freq: this.component_div.querySelector(".daily_repeat_freq").parentElement,
			// contains weekly_repeat_freq, frequency_day inputs
			weekly_repeat_freq: this.component_div.querySelector(".weekly_repeat_freq").parentElement,
			// contains monthly_repeat_freq, frequency_month_type, frequency_month_on_dates, inputs and frequency_month_on_the_key component
			monthly_repeat_freq: this.component_div.querySelector(".monthly_repeat_freq").parentElement.parentElement,
			// contains yearly_repeat_freq, frequency_year_in_month, frequency_year_on_the_key, frequency_year_on_the_value inputs
			yearly_repeat_freq: this.component_div.querySelector(".yearly_repeat_freq").parentElement,
			// contains frequency_month_on_dates inputs
			frequency_month_on_dates: this.component_div.querySelectorAll(".frequency_month_on_dates").item(0).parentElement.parentElement,
			// contains frequency_month_on_the_key, frequency_month_on_the_value inputs
			frequency_month_on_the_key: this.component_div.querySelector(".frequency_month_on_the_key").parentElement,
		};
		this._setEventListeners();
	}
	
	value(val){
		if(val === undefined){
			return this.generateRRule();
		}else{
			return this.populateForm(val);
		}
	}
	
	generateRRule(){
		var input = this._getFormValues();
		var event = {TRANSP: 'OPAQUE', DTSTART: '', DTEND: '', RRULE: ''};
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
 				break;
			case "custom":
				console.log("WEEKLY...");
				rrule.push('FREQ='+input.frequency.toUpperCase());
				switch(input.frequency){
					case "daily":
						rrule.push('INTERVAL='+input.daily_repeat_freq);
						break;
					case "weekly":
						console.log(input)
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
	
	populateForm(rule){
		this.inputs.all_day.checked = rule.TRANSP === 'TRANSPARENT';
		this.inputs.start_date.value = this._iCalToISODate(rule.DTSTART);
		this.inputs.start_time.value = this._iCalToISOTime(rule.DTSTART);
		this.inputs.end_date.value = this._iCalToISODate(rule.DTEND);
		this.inputs.end_time.value = this._iCalToISOTime(rule.DTEND);
		if(rule.RRULE){
			var rrules = this._parseRRULEString(rule.RRULE);
			if(rrules.INTERVAL){
				this.inputs.repeat_type.value = "custom";
				this.inputs.frequency.value = rrules.FREQ.toLowerCase();
				switch (rrules.FREQ.toLowerCase()) {
					case "daily":
						this.inputs.daily_repeat_freq.value = rrules.INTERVAL;
						break;
					case "weekly":
						this.inputs.weekly_repeat_freq.value = rrules.INTERVAL;
						rrules.BYDAY.split(",").map(d=>this.inputs.frequency_day.filter(i=>i.value===d)[0].checked = true);
						break;
					case "monthly":
						this.inputs.monthly_repeat_freq.value = rrules.INTERVAL;
						if(rrules.BYMONTHDAY){
							this.inputs.frequency_month_type.value = 'ondates';
						}else{
							this.inputs.frequency_month_type.value = 'onthe';
							if(rrules.BYSETPOS){
								this.inputs.frequency_month_on_the_key.value = rrules.BYSETPOS;
								switch(rrules.BYDAY){
									case "SU,MO,TU,WE,TH,FR,SA":
										this.inputs.frequency_month_on_the_value.value = 'day';
										break;
									case "MO,TU,WE,TH,FR":
										this.inpus.frequency_month_on_the_value.value = 'week_day';
										break;
									case "SU,SA":
										this.inputs.frequency_month_on_the_value.value = 'weekend_day';
										break;
								}
							}else{
								this.inputs.frequency_month_on_the_key.value = rrules.BYDAY.indexOf("-1") === 0 ? "-1" : rrules.BYDAY.substring(0, 1);
								this.inputs.frequency_month_on_the_value.value = rrules.BYDAY.indexOf("-1") === 0 ? rrules.BYDAY.substring(2, 2) : rrules.BYDAY.substring(1, 2);
							}
						}
						break;
					case "yearly":
						this.inputs.yearly_repeat_freq.value = rrules.INTERVAL;
						rrules.BYMONTH.split(",").forEach(d=>this.inputs.frequency_year_in_month.filter(i=>i.value===d)[0].checked = true);
						if(rrules.BYSETPOS){
							this.inputs.frequency_year_on_the_key.value = rrules.BYSETPOS;
							switch(rrules.BYDAY){
								case "SU,MO,TU,WE,TH,FR,SA":
									this.inputs.frequency_year_on_the_value.value = 'day';
									break;
								case "MO,TU,WE,TH,FR":
									this.inputs.frequency_year_on_the_value.value = 'week_day';
									break;
								case "SU,SA":
									this.inputs.frequency_year_on_the_value.value = 'weekend_day';
									break;
							}
						}else{
							this.inputs.frequency_year_on_the_key.value = rrules.BYDAY.indexOf("-1") === 0 ? "-1" : rrules.BYDAY.substring(0, 1);
							this.inputs.frequency_year_on_the_value.value = rrules.BYDAY.indexOf("-1") === 0 ? rrules.BYDAY.substring(2, 2) : rrules.BYDAY.substring(1, 2);
						}
						break;
				}
			}else{
				var keys = {DAILY: 'day', WEEKLY: 'week', MONTHLY: 'month', YEARLY: 'year'};
				this.inputs.repeat_type.value = keys[rrules.FREQ];
			}
			if(rrules.COUNT){
				this.inputs.simple_end_repeat.value = 'after';
				this.inputs.simple_end_repeat_after.value = rrules.COUNT;
			}else if(rrules.UNTIL){
				this.inputs.simple_end_repeat.value = 'ondate';
				this.inputs.simple_end_repeat_ondate.value = this._iCalToISODate(rule.UNTIL);
			}else{
				this.inputs.simple_end_repeat.value = 'never';
			}
		}else{
			this.inputs.repeat_type.value = "none";
		}
		this._renderSubcomponents();
	}
	
	_iCalToISODate(iCalDateTime){
		return iCalDateTime.substring(0, 4)+"-"+iCalDateTime.substring(4, 6)+"-"+iCalDateTime.substring(6, 8);
	}
	
	_iCalToISOTime(iCalDateTime){
		return iCalDateTime.substring(9, 11)+":"+iCalDateTime.substring(11, 13)+":"+iCalDateTime.substring(13, 15);
	}
	
	_parseRRULEString(rruleStr){
		var rrules = {};
		rruleStr.split(';').forEach(r=>{
			var [k, v] = r.split("=");
			if(k && v) rrules[k] = v;
			rrules[k] = v;
		});
		return rrules;
	}
	
	_getFormValues(){
		var all_day = this.inputs.all_day.checked;
		var start_date = this.inputs.start_date.value;
		var start_time = this.inputs.start_time.value;
		var end_date = this.inputs.end_date.value;
		var end_time = this.inputs.end_time.value;
		var repeat_type = this.inputs.repeat_type.options[this.inputs.repeat_type.selectedIndex].value;
		var simple_end_repeat = this.inputs.simple_end_repeat.options[this.inputs.simple_end_repeat.selectedIndex].value;
		var simple_end_repeat_after = this.inputs.simple_end_repeat_after.value;
		var simple_end_repeat_ondate = this.inputs.simple_end_repeat_ondate.value;
		var frequency = this.inputs.frequency.options[this.inputs.frequency.selectedIndex].value;
		var daily_repeat_freq = this.inputs.daily_repeat_freq.value;
		var weekly_repeat_freq = this.inputs.weekly_repeat_freq.value;
		var frequency_day = this.inputs.frequency_day.filter(i=>i.checked).map(e=>e.value);
		var monthly_repeat_freq = this.inputs.monthly_repeat_freq.value;
		var frequency_month_type = this.inputs.frequency_month_type.options[this.inputs.frequency_month_type.selectedIndex].value;
		var frequency_month_on_dates = this.inputs.frequency_month_on_dates.filter(i=>i.checked).map(e=>e.value);
		var frequency_month_on_the_key = this.inputs.frequency_month_on_the_key.options[this.inputs.frequency_month_on_the_key.selectedIndex].value;
		var frequency_month_on_the_value = this.inputs.frequency_month_on_the_value.options[this.inputs.frequency_month_on_the_value.selectedIndex].value;
		var yearly_repeat_freq = this.inputs.yearly_repeat_freq.value;
		var frequency_year_in_month = this.inputs.frequency_year_in_month.filter(i=>i.checked).map(e=>e.value);
		var frequency_year_on_the_key = this.inputs.frequency_year_on_the_key.options[this.inputs.frequency_year_on_the_key.selectedIndex].value;
		var frequency_year_on_the_value = this.inputs.frequency_year_on_the_value.options[this.inputs.frequency_year_on_the_value.selectedIndex].value;
		return {
			all_day, start_date, start_time, end_date, end_time, repeat_type, 
			simple_end_repeat, simple_end_repeat_after, simple_end_repeat_ondate,
			frequency, daily_repeat_freq, weekly_repeat_freq, frequency_day, monthly_repeat_freq,
			frequency_month_type, frequency_month_on_dates, frequency_month_on_the_key,
			frequency_month_on_the_value, yearly_repeat_freq, frequency_year_in_month,
			frequency_year_on_the_key, frequency_year_on_the_value, frequency_year_on_the_value
		};
	}
	
	_renderSubcomponents(){
		var values = this._getFormValues();
		// handle "all day" checkbox
		this.subcomponents.end_date.style.display = values.all_day ? 'none' : 'initial';
		this.subcomponents.start_time.style.display = values.all_day ? 'none' : 'initial';
		// handle "repeat_type" select
		this.subcomponents.end_repeat.style.display = values.repeat_type === 'none' ? 'none' : 'block';
		this.subcomponents.frequency_options.style.display = values.repeat_type === 'custom' ? 'block' : 'none';
		// handle "simple_end_repeat" select
		this.subcomponents.end_repeat_after.style.display = values.simple_end_repeat === 'after' ? 'inline' : 'none';
		this.subcomponents.end_repeat_ondate.style.display = values.simple_end_repeat === 'ondate' ? 'inline' : 'none';
		// handle "frequency" select
		this.subcomponents.daily_repeat_freq.style.display = values.frequency === 'daily' ? 'block' : 'none';
		this.subcomponents.weekly_repeat_freq.style.display = values.frequency === 'weekly' ? 'block' : 'none';
		this.subcomponents.monthly_repeat_freq.style.display = values.frequency === 'monthly' ? 'block' : 'none';
		this.subcomponents.yearly_repeat_freq.style.display = values.frequency === 'yearly' ? 'block' : 'none';
		// handle "frequency_month_type" select
		this.subcomponents.frequency_month_on_dates.style.display = values.frequency_month_type === 'ondates' ? 'block' : 'none';
		this.subcomponents.frequency_month_on_the_key.style.display = values.frequency_month_type === 'onthe' ? 'block' : 'none';
	}
	
	_setEventListeners(){
		// render components as they are neeed
		this.component_div.addEventListener('change', e => {
			if (e.target.matches(".all_day") ||
				e.target.matches(".repeat_type") ||
				e.target.matches(".simple_end_repeat") ||
				e.target.matches(".frequency") ||
				e.target.matches(".frequency_month_type")
			) this._renderSubcomponents();
		});
	}
}

