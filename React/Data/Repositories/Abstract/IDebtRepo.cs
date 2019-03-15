using React.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace React.Data.Repositories.Abstract
{
    public interface IDebtRepo
    {
        DebtViewModel GetAll(string memberId);
        DebtsFullInfoViewModel GetFullInfo(string userId);
    }
}
