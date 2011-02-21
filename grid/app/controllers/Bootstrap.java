package controllers;

import java.util.Locale;
import java.util.TimeZone;
import models.LocalisedTimeZone;
import play.jobs.Job;
import play.jobs.OnApplicationStart;

@OnApplicationStart
public class Bootstrap extends Job {

	@Override
	public void doJob() {
		if (LocalisedTimeZone.count() == 0) {
			for (String id : TimeZone.getAvailableIDs()) {
				final TimeZone zone = TimeZone.getTimeZone(id);
				new LocalisedTimeZone(zone, Locale.ENGLISH).save();
				new LocalisedTimeZone(zone, Locale.FRENCH).save();
				new LocalisedTimeZone(zone, new Locale("nl")).save();
			}
		}
	}

}
