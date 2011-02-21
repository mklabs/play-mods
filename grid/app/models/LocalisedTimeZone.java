package models;
 
import java.util.Locale;
import java.util.TimeZone;
import javax.persistence.Entity;
import play.db.jpa.Model;
 
@Entity
public class LocalisedTimeZone extends Model {
 
   public String timeZoneId;
   public String name;
   public String language;
   public int offset;
    
   public LocalisedTimeZone(TimeZone zone, Locale locale) {
      this.timeZoneId = zone.getID();
      this.name = zone.getDisplayName(locale);
      this.language = locale.getDisplayLanguage();
      this.offset = zone.getRawOffset() / 3600000;
   }
}
