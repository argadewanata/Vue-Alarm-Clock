const app = Vue.createApp({
    data(){
        const sound = new Audio("classic-alarm-sound.mp3");

        return {
            CurrentHour: null,
            CurrentMinute: null,
            CurrentSecond: null,

            CurrentDayName:null,
            CurrentDayNumber:null,
            CurrentMonth:null,
            CurrentYear:null,

            Hour24:[{value:'00'},{value:'01'},{value:'02'},{value:'03'},{value:'04'},{value:'05'},{value:'06'},{value:'07'},{value:'08'},{value:'09'},
                    {value:'10'},{value:'11'},{value:'12'},{value:'13'},{value:'14'},{value:'15'},{value:'16'},{value:'17'},{value:'18'},{value:'19'},
                    {value:'20'},{value:'21'},{value:'22'},{value:'23'}],

            Minute60:[{value:'00'}, {value:'01'}, {value:'02'}, {value:'03'}, {value:'04'}, {value:'05'}, {value:'06'}, {value:'07'}, {value:'08'}, {value:'09'},
                      {value:'10'}, {value:'11'}, {value:'12'}, {value:'13'}, {value:'14'}, {value:'15'}, {value:'16'}, {value:'17'}, {value:'18'}, {value:'19'},
                      {value:'20'}, {value:'21'}, {value:'22'}, {value:'23'}, {value:'24'}, {value:'25'}, {value:'26'}, {value:'27'}, {value:'28'}, {value:'29'},
                      {value:'30'}, {value:'31'}, {value:'32'}, {value:'33'}, {value:'34'}, {value:'35'}, {value:'36'}, {value:'37'}, {value:'38'}, {value:'39'},
                      {value:'40'}, {value:'41'}, {value:'42'}, {value:'43'}, {value:'44'}, {value:'45'}, {value:'46'}, {value:'47'}, {value:'48'}, {value:'49'},
                      {value:'50'}, {value:'51'}, {value:'52'}, {value:'53'}, {value:'54'}, {value:'55'}, {value:'56'}, {value:'57'}, {value:'58'}, {value:'59'}],

            Second60:[{value:'00'}, {value:'01'}, {value:'02'}, {value:'03'}, {value:'04'}, {value:'05'}, {value:'06'}, {value:'07'}, {value:'08'}, {value:'09'},
                      {value:'10'}, {value:'11'}, {value:'12'}, {value:'13'}, {value:'14'}, {value:'15'}, {value:'16'}, {value:'17'}, {value:'18'}, {value:'19'},
                      {value:'20'}, {value:'21'}, {value:'22'}, {value:'23'}, {value:'24'}, {value:'25'}, {value:'26'}, {value:'27'}, {value:'28'}, {value:'29'},
                      {value:'30'}, {value:'31'}, {value:'32'}, {value:'33'}, {value:'34'}, {value:'35'}, {value:'36'}, {value:'37'}, {value:'38'}, {value:'39'},
                      {value:'40'}, {value:'41'}, {value:'42'}, {value:'43'}, {value:'44'}, {value:'45'}, {value:'46'}, {value:'47'}, {value:'48'}, {value:'49'},
                      {value:'50'}, {value:'51'}, {value:'52'}, {value:'53'}, {value:'54'}, {value:'55'}, {value:'56'}, {value:'57'}, {value:'58'}, {value:'59'}],          

            SetAlarmHour: null,
            SetAlarmMinute: null,
            SetAlarmSecond: null,

            AlarmHour: null,
            AlarmMinute: null, 
            AlarmSecond: null, 

            AlarmSound: sound,

            AlarmList: [],
            AlarmSnooze: {},
        }
    },

    watch: {
        AlarmList: {
            handler(alarm, oldAlarm){
                localStorage.setItem('alarmList', JSON.stringify(alarm));
            },

            deep: true,
        },
    },

    mounted() {
        setInterval(() => this.getCurrentDateTime(), 1000)
        setInterval(() => this.checkAlarm(), 1000)
        setInterval(() => this.checkSnoozeAlarm(), 1000)
        
        // Toastr Notification
        toastr.options.closeButton = true;
        toastr.options.newestOnTop = false;
        toastr.options.preventDuplicates = true;

        this.AlarmList = JSON.parse(localStorage.getItem('alarmList')) || [];
        console.log("ini adalah alarm listnya:" + this.AlarmList);  
    },
    methods:{
        checkValue(){

            // Function to check if input is a number
            const isNumber = n => {
                return !isNaN(n) && !isNaN(parseInt(n))
            }

            // Check if input is null
            if(this.AlarmHour == null) {
                return "Alarm Hour Type is Required"
            }

            else if(this.AlarmMinute == null) {
                return "Alarm Minute Type is Required"
            }

            else if(this.AlarmSecond== null) {
                return "Alarm Second Type is Required"
            }

            // Check if input is number
            if(!isNumber(this.AlarmHour)) {
                return "Hour is not a number"
            }

            else if(!isNumber(this.AlarmMinute)) {
                return "Minute is not a number"
            }

            else if(!isNumber(this.AlarmSecond)) {
                return "Second is not a number"
            }

            // Check if input is negative
            if(parseInt(this.AlarmHour) < 0) {
                return "Alarm Hour Must Be Positive"
            }

            else if(parseInt(this.AlarmMinute) < 0) {
                return "Alarm Minute Must Be Positive"
            }

            else if(parseInt(this.AlarmSecond) < 0) {
                return "Alarm Second Must Be Positive"
            }

            // Check if input between 00 - 23 hours, 00 - 59 minutes, and 00 - 59 seconds
            if(parseInt(this.AlarmHour) > 23) {
                return "Alarm Hour Must Not Exceed 23"
            }

            else if(parseInt(this.AlarmMinute) > 59) {
                return "Alarm Minute Must Not Exceed 59"
            }

            else if(parseInt(this.AlarmSecond) > 59) {
                return "Alarm Second Must Not Exceed 59"
            }
            return ""
        },
        getCurrentDateTime() {
            const date = new Date();
            this.CurrentHour      = this.checkSingleDigit(date.getHours())
            this.CurrentMinute    = this.checkSingleDigit(date.getMinutes())
            this.CurrentSecond    = this.checkSingleDigit(date.getSeconds())

            this.CurrentDayName   = date.toLocaleString("default",{weekday:"long"});
            this.CurrentDayNumber = this.checkSingleDigit(date.getDate());
            this.CurrentMonth     = date.toLocaleString("default",{month:"long"});
            this.CurrentYear      = date.getFullYear();
        },
        checkSingleDigit (digit) {
            return ('0' + digit).slice(-2)
        },
        setAlarm(){
            const msg = this.checkValue()
            if (msg != "") {
                toastr.error(msg)
                return;
            }

            this.SetAlarmHour = this.AlarmHour
            this.SetAlarmMinute = this.AlarmMinute
            this.SetAlarmSecond = this.AlarmSecond
                 
            this.AlarmList.push({
                hour: this.SetAlarmHour,
                minute: this.SetAlarmMinute,
                second: this.SetAlarmSecond
            })

            toastr.success(`Alarm telah ditambahkan pada ${this.SetAlarmHour}:${this.SetAlarmMinute}:${this.SetAlarmSecond}`)
        },
        checkAlarm(){
            for (let i = 0; i<this.AlarmList.length; i++) {
                console.log(this.AlarmList[i])
                if ((this.CurrentHour == this.AlarmList[i].hour) && (this.CurrentMinute == this.AlarmList[i].minute) && (this.CurrentSecond == this.AlarmList[i].second)) {
                    this.playSound()
                }
            }
        },
        checkSnoozeAlarm() {
            const {hour, minute, second} = this.AlarmSnooze
            if ((this.CurrentHour == hour) && (this.CurrentMinute == minute) && (this.CurrentSecond == second)) {
                this.playSound()
            }
        },
        deleteAlarm(alarmToDelete){
            this.AlarmList = this.AlarmList.filter(alarm => alarm != alarmToDelete)
            localStorage.removeItem('alarmList');

            toastr.success("Alarm has been deleted.")
        },
        playSound(){
            this.AlarmSound.play();
        },
        stopSound(){
            this.AlarmSound.pause();
            this.AlarmSnooze = {};
        },
        snooze(){
            this.AlarmSound.pause();

            const {hour, minute, second} = this.AlarmSnooze;

            // 23 59 59
            if (hour == 23 && minute == 59 && second == 59) {
                this.AlarmSnooze = {
                    hour: 0,
                    minute: 0,
                    second: 0
                }
                toastr.info(`Alarm is snoozed. Ringing in 1 minute.`)
                return;
            }

            if (second == "59") {
                const SnoozedAlarmMinute = parseInt(this.SetAlarmMinute) + 1
                this.SetAlarmMinute = this.checkSingleDigit(SnoozedAlarmMinute);

                this.AlarmSnooze = {
                    hour: this.SetAlarmHour,
                    minute: SnoozedAlarmMinute,
                    second: this.SetAlarmSecond
                }
    
                toastr.info(`Alarm is snoozed. Ringing in 1 minute.`)
                return;
            }

            if (minute == "59") {
                const SnoozedAlarmHour = parseInt(this.SetAlarmHour) + 1
                this.SetAlarmHour = this.checkSingleDigit(SnoozedAlarmHour);

                this.AlarmSnooze = {
                    hour: SnoozedAlarmHour,
                    minute: this.SetAlarmMinute,
                    second: this.SetAlarmSecond
                }
    
                toastr.info(`Alarm is snoozed. Ringing in 1 minute.`)
                return;
            }

            const SnoozedAlarmMinute = parseInt(this.SetAlarmMinute) + 1
            this.SetAlarmMinute = this.checkSingleDigit(SnoozedAlarmMinute);

            this.AlarmSnooze = {
                hour: this.SetAlarmHour,
                minute: SnoozedAlarmMinute,
                second: this.SetAlarmSecond
            }

            toastr.info(`Alarm is snoozed. Ringing in 1 minute.`)
        },
    }   
})

app.mount("#app");


