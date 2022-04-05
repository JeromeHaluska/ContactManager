/*import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import com.example.demo.model.Contact;

import org.springframework.data.jpa.domain.Specification;

class ContactWithTag implements Specification<Contact> {

    private String tagTitle;
    
    // constructor omitted for brevity
    
    public Predicate toPredicate(Root<T> root, CriteriaQuery query, CriteriaBuilder cb) {
        if (tagTitle == null) {
            return cb.isTrue(cb.literal(true)); // always true = no filtering
        }
        return cb.equal(root.get("tag"), this.firstName);
    }
}*/