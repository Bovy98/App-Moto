package main;

import java.io.Reader;
import java.util.Date;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import com.riccardo.mapper.ImmatricolazioniMapper;
import com.riccardo.mapper.MotoMapper;
import com.riccardo.models.Immatricolazioni;
import com.riccardo.models.Moto;

public class main {

	public static void main(String[] args) throws Exception {
		Reader reader = Resources.getResourceAsReader("configuration.xml");

		SqlSessionFactoryBuilder builder = new SqlSessionFactoryBuilder();
		SqlSessionFactory factory = builder.build(reader);

		try (SqlSession session = factory.openSession()) {
			MotoMapper motoMapper = session.getMapper(MotoMapper.class);
			Moto moto = motoMapper.selectByPrimaryKey(86);
			// System.out.println("Record = " + moto.toString());
			System.out.println("La moto letta e': " + moto.toString());

			ImmatricolazioniMapper immMapper = session.getMapper(ImmatricolazioniMapper.class);
			Immatricolazioni immatricolaz = new Immatricolazioni();
			immatricolaz.setIdMoto(moto.getIdMoto());
			immatricolaz.setTarga("GHJKLL");
			immatricolaz.setDataImmatricolazione(new Date());
			int nImm = immMapper.insert(immatricolaz);
			session.commit();
			session.close();
			System.out.println("Inseriti = " + nImm);
			System.out.println("Immatricolazione inserita: " + immatricolaz.toString());

		}
	}
}
